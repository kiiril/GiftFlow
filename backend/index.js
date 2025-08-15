const express = require("express");
const app = express();
require("dotenv").config()
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const port = 8108;

const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const tags = require("./routes/tags");
const locations = require("./routes/locations");
const auth = require("./routes/auth");

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // server static files, TODO restrict from everyone, organise structure

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods:["GET", "POST", "PUT", "DELETE"],
    origin: process.env.NODE_ENV === "production" ? true : "http://localhost:3108",
    credentials: true,
}))
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" && process.env.HTTPS === "true",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: process.env.NODE_ENV === "production" ? 'strict' : 'lax',
    },
}));

app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/tags", tags);
app.use("/api/locations", locations);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})