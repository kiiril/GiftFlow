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

// users.post("/", async (req, res, next) => {
//     try {
//         const {email, password} = req.body;
//         const newUser = await db.createUser(email, password);
//         res.json(newUser);
//         res.status(200);
//         res.end();
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//         next();
//     }
// });

users.post("/signup", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (email && password) {
            const queryResult = await db.getUserByEmail(email);
            if (queryResult.length === 0) {
                const newUser = await db.createUser(email, password);
                res.status(200);
                res.json(newUser); // FIXME think what must be sent
                res.end();
            } else {
                console.log("User already registered"); // return error msg
            }
        } else {
            console.log("Please enter email and password!"); // return the error message
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

users.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (email && password) {
            const queryResult = await db.getUserByEmail(email);
            if (queryResult.length > 0) {
                const user = queryResult[0];
                if (password === user.password) {
                    res.status(200);
                    res.json(user) // TODO add indication that user logged in
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

users.put("/:id", async (req, res, next) => {
    try {
        console.log("Body", req.body)
        const updatedUser = await db.updateUser(req.params.id, req.body);
        res.status(200);
        res.json(updatedUser);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

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