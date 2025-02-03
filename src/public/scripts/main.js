document.addEventListener("DOMContentLoaded", () => {
  // Get the container element for the column
  const container = document.getElementById("balloon-column");
  // Use the container's actual dimensions
  const columnWidth = container.clientWidth; // should be 350px per your CSS
  const columnHeight = container.clientHeight; // dynamic height from CSS/layout

  // Alias Matter modules
  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Query = Matter.Query,
    Body = Matter.Body; // needed for scaling

  // 1. Create the engine and set upward gravity (slow)
  const engine = Engine.create();
  engine.world.gravity.y = -0.035; // A gentle upward pull

  // 2. Create a renderer that draws inside our container using its dynamic dimensions
  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: columnWidth,
      height: columnHeight,
      wireframes: false, // Render as solid shapes (sprites will be used instead)
      background: "#ffffff",
    },
  });
  Render.run(render);

  // 3. Create a runner to update the engine
  const runner = Runner.create();
  Runner.run(runner, engine);

  // 4. Create boundaries that exactly match the container's dimensions
  const leftWall = Bodies.rectangle(10, columnHeight / 2, 20, columnHeight, {
    isStatic: true,
  });
  const rightWall = Bodies.rectangle(
    columnWidth - 10,
    columnHeight / 2,
    20,
    columnHeight,
    { isStatic: true }
  );
  const topWall = Bodies.rectangle(columnWidth / 2, 10, columnWidth, 20, {
    isStatic: true,
  });
  const bottomWall = Bodies.rectangle(
    columnWidth / 2,
    columnHeight - 10,
    columnWidth,
    20,
    { isStatic: true }
  );
  Composite.add(engine.world, [leftWall, rightWall, topWall, bottomWall]);

  // 5. Balloon creation: continually maintain up to maxBalloons.
  // When a balloon is popped, the count is decremented, and a new one can be added.
  let balloonCount = 0;
  const maxBalloons = 10;

  // Utility function: Returns a random sprite from the available options.
  function randomSprite() {
    const sprites = ["10.png", "11.png", "12.png"];
    return sprites[Math.floor(Math.random() * sprites.length)];
  }

  // 6. Function to simulate a pop: gradually expand then remove the balloon.
  function popBalloon(balloon) {
    const expansionSteps = 5;
    const finalExpansionFactor = 1.5; // final size is 150% of original
    const expansionInterval = 10; // ms per step
    // Calculate the per-step scale factor (so that after expansionSteps, the total scale is finalExpansionFactor)
    const stepScale = Math.pow(finalExpansionFactor, 1 / expansionSteps);
    let steps = 0;
    const intervalId = setInterval(() => {
      if (steps < expansionSteps) {
        // Scale the balloon by the step factor
        Body.scale(balloon, stepScale, stepScale);
        steps++;
      } else {
        clearInterval(intervalId);
        // Remove the balloon after expansion
        Composite.remove(engine.world, balloon);
        balloonCount = Math.max(balloonCount - 1, 0);
      }
    }, expansionInterval);
  }

  // Every 2 seconds, if there are fewer than maxBalloons, add a new balloon.
  setInterval(() => {
    if (balloonCount < maxBalloons) {
      // Use a horizontal margin so they don't start too close to the walls.
      const margin = 40;
      const x = Math.random() * (columnWidth - 2 * margin) + margin;
      const y = columnHeight - 50; // Start near the bottom

      // Create a new balloon with a physics radius of 40,
      // and use a random sprite.
      const balloon = Bodies.circle(x, y, 40, {
        label: "balloon",
        restitution: 1, // bounciness
        render: {
          sprite: {
            texture: randomSprite(), // randomly choose from "10.png", "11.png", "12.png"
            xScale: 0.065,
            yScale: 0.065,
          },
        },
      });

      Composite.add(engine.world, balloon);
      balloonCount++;
    }
  }, 5000);

  // 7. Add a click event listener so that clicking a balloon "pops" it with an expansion effect.
  render.canvas.addEventListener("click", (event) => {
    // Determine mouse position relative to the canvas
    const rect = render.canvas.getBoundingClientRect();
    const mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    // Query all bodies for those containing the click position
    const allBodies = Composite.allBodies(engine.world);
    const clickedBodies = Query.point(allBodies, mousePosition);

    // For each body labeled as "balloon", perform the pop animation.
    clickedBodies.forEach((body) => {
      if (body.label === "balloon") {
        popBalloon(body);
      }
    });
  });
});
