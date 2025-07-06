const db = require("../db/dbConn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "..", "uploads", "posts");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Give each file a unique name: <timestamp>-<random>-<originalname>
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-${random}${ext}`);
    },
});

// 1.B) Filter only JPEG/PNG/GIF under 5MB (adjust size if you like)
const fileFilter = (req, file, cb) => {
    const allowedMime = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMime.includes(file.mimetype)) {
        return cb(new Error("Only JPEG/PNG/GIF images are allowed"), false);
    }
    cb(null, true);
};

// 1.C) Limit to, say, max 5 images per post, 5MB each
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
});

async function getAllPosts(req, res, next){
    try {
        const {page = 1, limit = 10} = req.query;
        const offset = (page - 1) * limit;

        const posts = await db.getPosts(parseInt(limit), offset);

        const userId = req.session.user_id;
        // Add isSaved field for each post
        if (userId) {
            for (const post of posts) {
                const isSaved = await db.isPostSavedByUser(post.id, userId);
                post.isSaved = !!isSaved;
            }
        }

        return res.status(200).json(posts);
    } catch (err) {
        console.log("Error fetching posts:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function handlePostCreate(req, res, next) {
    try {
        const { userId, title, location, tagIds, description, price } = req.body;
        const imageFiles = req.files;

        let imageUrls = [];
        if (imageFiles.length > 0) {
            for (const imageFile of imageFiles) {
                const imageUrl = `/uploads/posts/${imageFile.filename}`;
                imageUrls.push(imageUrl);
            }
        } else {
            imageUrls.push("/uploads/posts/placeholder.png");
        }

        const createdPost = await db.createPost(
            userId,
            title,
            location,
            JSON.parse(tagIds),
            description,
            parseFloat(price),
            imageUrls
        )

        return res.status(201).json(createdPost);
    } catch (err) {
        console.log("Error creating post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

const createPost = [upload.array("images", 5), handlePostCreate];

async function getPost(req, res, next) {
    try {
        const postId = parseInt(req.params.id);

        const rows = await db.getPost(postId);
        if (rows.length === 0) {
            return res.status(404).send({ message: "Post not found" });
        }

        const post = rows[0];

        const userId = req.session.user_id;
        if (userId) {
            const isSaved = await db.isPostSavedByUser(postId, userId);
            post.isSaved = !!isSaved;
        }

        return res.status(200).json(post);
    } catch (err) {
        console.log("Error fetching post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function handlePostUpdate(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const { title, location, tagIds, description, price } = req.body;
        const imageFiles = req.files;

        let imageUrls = [];
        if (imageFiles.length > 0) {
            const rows = await db.getPost(postId);
            const oldImages = rows[0]?.image_urls || [];
            if (oldImages) {
                for (const oldImage of oldImages) {
                    const oldPath = path.join(__dirname, "..", oldImage);
                    fs.unlink(oldPath, err => {
                        if (err && err.code !== "ENOENT") {
                            console.error("Failed to delete old image:", err);
                        }
                    });
            }
        }
            for (const imageFile of imageFiles) {
                const imageUrl = `/uploads/posts/${imageFile.filename}`;
                imageUrls.push(imageUrl);
            }
        }

        const updatedPost = await db.updatePost(
            postId,
            title,
            location,
            JSON.parse(tagIds),
            description,
            parseFloat(price),
            imageUrls
        )

        return res.status(200).json(updatedPost);
    } catch (err) {
        console.log("Error updating post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

const updatePost = [upload.array("images", 5), handlePostUpdate];

async function deletePost(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const rows = await db.getPost(postId);
        if (rows.length === 0) {
            return res.status(404).send({ message: "Post not found" });
        }

        const oldImages = rows[0]?.image_urls || [];
        if (oldImages) {
            for (const oldImage of oldImages) {
                const oldPath = path.join(__dirname, "..", oldImage);
                fs.unlink(oldPath, err => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Failed to delete old image:", err);
                    }
                });
            }
        }

        await db.deletePost(postId);
        return res.status(204).send();
    } catch (err) {
        console.log("Error deleting post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function getComments(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const comments = await db.getPostComments(postId);
        return res.status(200).json(comments);
    } catch (err) {
        console.log("Error fetching comments:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function createComment(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const { content } = req.body;
        const userId = req.session.user_id;

        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const newComment = await db.createPostComment(postId, userId, content);
        return res.status(201).json(newComment);
    } catch (err) {
        console.log("Error creating comment:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function savePostToFavourites(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.session.user_id;

        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const result = await db.savePostToFavourites(postId, userId);
        return res.status(200).json({ success: !!result.affectedRows });
    } catch (err) {
        console.log("Error saving post to favorites:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function removePostFromFavourites(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.session.user_id;

        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const result = await db.removePostFromFavourites(postId, userId);
        return res.status(200).json({ success: !!result.affectedRows });
    } catch (err) {
        console.log("Error removing post from favorites:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllPosts,
    createPost,
    getPost,
    updatePost,
    deletePost,
    getComments,
    createComment,
    savePostToFavourites,
    removePostFromFavourites
}