const express = require("express");
const users = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/dbConn");

users.post("/login", async (req, res, next) => {
    // todo: add some checks
    const {email, password} = req.body;
    let user = await db.getUserByEmail(email);

    user = user[0]

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
});

users.post("/signup", async (req, res, next) => {
    // todo: add more checks
    const {email, password} = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser[0]) {
        return res.status(400).json({ message: 'User already exists.' }); // fixme: maybe it is not good to expose this info
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.createUser(email, hashedPassword);
        // Automatically log the user in
        req.session.userId = newUser.id;
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Something went wrong during signup.' });
        next();
    }
});

users.put("/:id", async (req, res, next) => {
    const {name, surname, dateOfBirthday, location, gender} = req.body;
    try {
        const updatedUser = await db.updateUser(req.params.id, name, surname, dateOfBirthday, location, gender);
        res.status(200);
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