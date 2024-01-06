const express = require("express");
const users = express.Router();
const database = require("../db/dbConnection");

users.post("/login", async (req, res, next) => {
    try {
        console.log(req.body); // check the state of request
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            const queryResult = await database.authUser(username);
            console.log(queryResult);
            if (queryResult.length > 0) {
                if (password === queryResult[0].password) {
                    res.status(200); // statusCode???
                    console.log("Login is successfully");
                } else {
                    res.status(200);
                    console.log("Incorrect password was inserted");
                }
            } else {
                res.status(200);
                console.log("Can not find such user in database");
            }
        } else {
            res.status(200);
            console.log("Username or password is not specified");
        }
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500);
        next();
    }
});

module.exports = users;