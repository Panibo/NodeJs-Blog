const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express and MongoDB.",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([
      {
        $sort: { createdAt: -1 },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      hasNextPage,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description:
        data.content.substring(0, 100) +
        (data.content.length > 100 ? "..." : ""),
    };

    res.render("post", {
      locals,
      data,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Search results",
    };
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { content: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
