const express = require("express");
const app = express();
require("dotenv").config()
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const port = 8080; // 8108

const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // server static files, TODO restrict from everyone, organise structure

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods:["GET", "POST", "PUT", "DELETE"]
}))
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        maxAge: 3600000, // 1 hour
    },
}));

app.use("/posts", posts);
app.use("/users", users);
app.use("/comments", comments);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})