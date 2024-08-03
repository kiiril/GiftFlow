const express = require("express");
const posts = express.Router();
const db = require("../db/dbConn");

posts.get("/", async (req, res, next) => {
    try {
        const posts = await db.getPosts();
        res.status(200);
        res.json(posts);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.get("/:id", async (req, res, next) => {
    try {
        const post = await db.getPost(req.params.id);
        res.status(200);
        res.json(post);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.post("/", async (req, res, next) => {
    try {
        const {title, views, rating, description} = req.body;
        const newPost = await db.createPost(title, views, rating, description);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.put("/:id", async (req, res, next) => {
    try {
        const {title, views, rating, description} = req.body;
        const updatedPost = await db.updatePost(req.params.id, title, views, rating, description);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.delete("/:id", async (req, res, next) => {
    try {
        const deletedPost = await db.deletePost(req.params.id);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = posts;