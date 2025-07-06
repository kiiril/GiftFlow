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
const tags = require("./routes/tags");
const locations = require("./routes/locations");
const auth = require("./routes/auth");

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // server static files, TODO restrict from everyone, organise structure

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods:["GET", "POST", "PUT", "DELETE"],
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

app.use("/auth", auth);
app.use("/posts", posts);
app.use("/users", users);
app.use("/comments", comments);
app.use("/tags", tags);
app.use("/locations", locations);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})