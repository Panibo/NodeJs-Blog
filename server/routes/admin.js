const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

const adminLayout = "../views/layouts/admin";

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Admin Panel",
    };

    res.render("admin", {
      locals,
      layout: adminLayout,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (req.body.username === "admin" && req.body.password === "admin") {
      res.send("Logged in");
    } else {
      res.send("Wrong username or password");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
