const express = require("express");
const {updateUser, getUser} = require("../controllers/userController");
const isAuthenticated = require("../middleware/auth");
const router = express.Router();

router.get("/me", isAuthenticated, getUser);

router.put("/me", isAuthenticated, updateUser);
//
// users.delete("/:id", async (req, res, next) => {
//     try {
//         const deletedUser = await db.deleteUser(req.params.id);
//         res.status(200);
//         res.end();
//     } catch (e) {
//         console.log(e);
//         res.sendStatus(500);
//         next();
//     }
// });

module.exports = router;