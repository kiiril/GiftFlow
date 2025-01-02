const express = require("express");
const posts = express.Router();
const db = require("../db/dbConn");

posts.get("/", async (req, res, next) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const offset = (page - 1) * limit;
        const posts = await db.getPosts(parseInt(limit), offset);
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
        const post = await db.getPost(parseInt(req.params.id));
        res.status(200);
        res.json(post[0]); // fixme: mb structure better
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

posts.post("/", async (req, res, next) => {
    try {
        const {userId, title, description, imageUrls, price} = req.body;
        const newPost = await db.createPost(userId, title, description, imageUrls, price);
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
        const {title, description, imageUrls, price} = req.body;
        const updatedPost = await db.updatePost(req.params.id, title, description, imageUrls, price);
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