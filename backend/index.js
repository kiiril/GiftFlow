const express = require("express");
const app = express();
require("dotenv").config()
const cors = require("cors");
const path = require("path");
const port = 8080; // 8108

const posts = require("./routes/posts");
const users = require("./routes/users");

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // server static files, TODO restrict from everyone, organise structure

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods:["GET", "POST", "PUT", "DELETE"]
}))

app.use("/posts", posts);
app.use("/users", users);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})