const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const appointmentRoutes = require("./src/routes/appointmentRoutes");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //1
app.use(methodOverride("_method"));
app.use("/", appointmentRoutes);

module.exports = app;
