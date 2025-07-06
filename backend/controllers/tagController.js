const db = require("../db/dbConn");

async function getAllTags(req, res, next) {
    try {
        const tags = await db.getTags();
        return res.status(200).json(tags);
    } catch (err) {
        console.error("Error fetching tags:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllTags,
};