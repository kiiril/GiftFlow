const express = require("express");
const users = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/dbConn");

users.post("/login", async (req, res, next) => {
    // todo: allow using username for login as well
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Fetch user by email
        let user = await db.getUserByEmail(email);
        user = user[0]
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Set session
        req.session.user_id = user.id;

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

users.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //     return res.status(400).json({ message: 'Invalid email format.' });
    // }
    //
    // if (password.length < 8) {
    //     return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    // }

    try {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser[0]) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.createUser(email, hashedPassword);

        // Automatically log the user in
        req.session.user_id = newUser.id;

        res.status(201).json({
            message: 'Signup successful',
            user: { id: newUser.id, email: newUser.email }
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: 'An error occurred during signup.' });
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