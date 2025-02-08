const express = require("express");
const tags = express.Router();
const db = require("../db/dbConn");

tags.get("/", async (req, res, next) => {
    try {
        const tags = await db.getTags();
        res.status(200);
        res.json(tags);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = tags;