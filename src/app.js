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
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

app.use("/", homeRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

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
  console.log(`Blog-Frontend-Viewer - listening on port ${PORT}!`);
});
