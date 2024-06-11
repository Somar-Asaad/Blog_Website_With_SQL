const express = require("express");
const db = require("../data/database");
const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const queryCode = `
  SELECT posts.*, authors.name AS author_name FROM posts
  INNER JOIN authors ON posts.author_id = authors.id `;

  const [posts] = await db.query(queryCode);

  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors });
});

router.post("/new-post", async function (req, res) {
  const values = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO blogs.posts (title, summary, body, author_id) Values (?)",
    [values]
  );
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res) {
  const query = `
  DELETE FROM posts WHERE (?) = posts.id`;
  await db.query(query, [req.params.id]);
  res.redirect("/posts");
});
module.exports = router;

router.get("/posts/:id/update", async function (req, res) {
  const query = `SELECT * FROM posts WHERE ? = posts.id`;

  const [postDetails] = await db.query(query, [req.params.id]);

  if (!postDetails || postDetails.length === 0) {
    return res.status(404).render("404");
  }

  res.render("update-post", { postDetails: postDetails[0] });
});

router.post("/posts/:id/update", async function (req, res) {
  const query = `UPDATE posts SET title=?, summary=?, body=? WHERE ? = id`;
  const queryParams = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ];
  await db.query(query, queryParams);
  res.redirect("/posts");
});

router.get("/posts/:id", async function (req, res) {
  const query = `SELECT posts.*, authors.name AS author_name , authors.email AS author_email FROM posts INNER JOIN authors ON authors.id = posts.author_id where posts.id = ?`;
  const [newPost] = await db.query(query, [req.params.id]);

  post = {
    ...newPost[0],
    date: newPost[0].date.toISOString(),
    humanReadableFormat: newPost[0].date.toLocaleDateString("en-US", {
      year: "numeric",
      day: "numeric",
      month: "long",
      weekday: "long",
    }),
  };


  res.render("post-detail", { post });
});
