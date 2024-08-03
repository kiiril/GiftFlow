const express = require("express");
const app = express();
require("dotenv").config()
const port = 8108;

const posts = require("./routes/posts");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", posts);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})