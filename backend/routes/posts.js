const express = require("express");
const posts = express.Router();
const db = require("../db/dbConn");

posts.get("/", async (req, res, next) => {
    try {
        const posts = await db.getPosts();
        res.status(200)
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.get("/:id", async (req, res, next) => {
    try {
        const post = await db.getPost(req.params.id);
        res.status(200)
        res.json(post);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = posts;