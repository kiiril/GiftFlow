const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = 8108; // famnit server port
const users = require("./routes/users");


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST"],
    origin: "http://localhost:3000"
}));
app.use("/users", users);

app.get("/", function (req, res) {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
});