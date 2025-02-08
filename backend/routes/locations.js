const express = require("express");
const locations = express.Router();
const db = require("../db/dbConn");

locations.get("/", async (req, res, next) => {
    try {
        const locations = await db.getLocations();
        res.status(200);
        res.json(locations);
        res.end();
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = locations;

