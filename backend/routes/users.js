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

users.post("/login", async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email && password) {
            const queryResult = await db.getUserByEmail(email);
            if (queryResult.length > 0) {
                const user = queryResult[0];
                if (password === user.password) {
                    res.status(200);
                    res.json({user, isAuth: true});
                    console.log("SESSION VALID"); // return success msg
                } else {
                    console.log("INCORRECT PASSWORD"); // return error msg
                }
            } else {
                console.log("USER NOT REGISTERED"); // return error msg
            }
        } else {
            console.log("Please enter email and password!"); // return the error message
        }
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