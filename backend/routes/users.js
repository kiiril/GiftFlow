const express = require("express");
const users = express.Router();
const db = require("../db/dbConn");

users.get("/", async (req, res, next) => {
    try {
        const users = await db.getUsers();
        res.status(200);
        res.json(users);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

users.get("/:id", async (req, res, next) => {
    try {
        const user = await db.getUser(req.params.id);
        res.status(200);
        res.json(user);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

users.post("/", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const newUser = await db.createUser(email, password);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

// TODO: Implement the PUT method

users.delete("/:id", async (req, res, next) => {
    try {
        const deletedUser = await db.deleteUser(req.params.id);
        res.status(200);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = users;