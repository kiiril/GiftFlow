const express = require("express");
const comments = express.Router();
const db = require("../db/dbConn");

comments.get("/", async (req, res, next) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const offset = (page - 1) * limit;
        const comments = await db.getComments(parseInt(limit), offset);
        res.status(200);
        res.json(comments);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

comments.get("/:id", async (req, res, next) => {
    try {
        const comment = await db.getComment(parseInt(req.params.id));
        res.status(200);
        res.json(comment[0]); // fixme: mb structure better
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

comments.post("/", async (req, res, next) => {
    try {
        const {userId, postId, parentCommentId, content} = req.body;
        const newComment = await db.createComment(userId, postId, parentCommentId, content);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = comments;