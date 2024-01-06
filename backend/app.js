const express = require("express");
const app = express();
require("dotenv").config();
const port = 8108; // famnit server port
const users = require("./routes/users");


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/users", users);

app.get("/", function (req, res) {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
});