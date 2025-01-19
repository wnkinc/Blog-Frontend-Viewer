// app.js
require("dotenv").config();
const path = require("path");
const express = require("express");

const app = express();

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/**
 * -------------- ROUTES ----------------
 */
const homeRoutes = require("./routes/home.routes");
const postRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/", homeRoutes);
// app.use("/post", postRoutes); // Blog post routes
// app.use("/auth", authRoutes); // Auth-related routes
// app.use("/user", userRoutes); // User-related routes

/**
 * -------------- Error handling ----------------
 */
// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { title: "Server Error", error: err });
});

/**
 * -------------- Server ----------------
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express app - listening on port ${PORT}!`);
});
