const express = require("express");
const router = express.Router();
const db = require("../db/dbConn");
const {getAllPosts, createPost, getPost, updatePost, deletePost, getComments, createComment, savePostToFavourites,
    removePostFromFavourites, getAllMyPosts
} = require("../controllers/postController");

router.get("/", getAllPosts);

router.get("/me", getAllMyPosts);

router.post("/", createPost);

router.post("/:id/save", savePostToFavourites);

router.post("/:id/unsave", removePostFromFavourites);

router.get("/:id", getPost);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

router.get("/:id/comments", getComments);

router.post("/:id/comments", createComment);

module.exports = router;