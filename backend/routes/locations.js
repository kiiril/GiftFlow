const express = require("express");
const locations = express.Router();
const db = require("../db/dbConn");
const fs = require('fs');
const path = require('path');

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

locations.get("/tree", async (req, res, next) => {
    try {
        const jsonPath = path.join(__dirname, '..', 'locations.json');
        const locationsData = fs.readFileSync(jsonPath, 'utf8');
        const locations = JSON.parse(locationsData);
        res.status(200).json(locations);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        next();
    }
});

module.exports = locations;
