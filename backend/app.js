const express = require("express");
const app = express();
const port = 8108; // famnit server port

app.get("/", function (req, res) {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Webserver listening on port ${port}`);
});