const db = require("../db/dbConn");
const bcrypt = require("bcrypt");

async function login(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await db.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration error:", err);
                return res.status(500).json({ message: "An error occurred during login." });
            }

            req.session.user_id = user.id;

            delete user.password;

            return res.status(200).json(user);
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
}

async function signup(req, res, next) {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({
            message: "Username, email, and password are all required.",
        });
    }

    try {
        const rows = await db.getUserByEmail(email);
        if (rows.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultAvatarUrls = ["/uploads/avatars/default1.png", "/uploads/avatars/default2.png", "/uploads/avatars/default3.png"];
        const randomAvatarUrl = defaultAvatarUrls[Math.floor(Math.random() * defaultAvatarUrls.length)];
        const newUser = await db.createUser(username, email, hashedPassword, randomAvatarUrl);

        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration error:", err);
                return res.status(500).json({ message: "An error occurred during signup." });
            }

            req.session.user_id = newUser.id;

            delete newUser.password;

            return res.status(201).json(newUser);
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
}

module.exports = {
    login,
    signup,
}
