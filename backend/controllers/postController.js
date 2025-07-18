const db = require("../db/dbConn");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {request} = require("express");

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
        cb(null, `${timestamp}-${random}${ext}`); // todo: this is the best naming
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
        const {page = 1, limit = 10, tags, locations} = req.query;
        const offset = (page - 1) * limit;

        const tagIds = tags ? tags.split(',').map(id => parseInt(id, 10)) : [];
        const locationStrings = locations ? locations.split(';') : [];

        const posts = await db.getPosts(parseInt(limit), offset, tagIds, locationStrings);

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
        const { title, location, tagIds, description, price, currency } = req.body;
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

        const userId = req.session.user_id;

        const createdPost = await db.createPost(
            parseInt(userId),
            title,
            location,
            JSON.parse(tagIds),
            description,
            parseFloat(price),
            currency,
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

        const post = await db.getPost(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

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
        const { title, location, tagIds, description, price, currency } = req.body;
        const imageFiles = req.files;

        const images = JSON.parse(req.body.images)

        const current = await db.getPostImages(postId);

        const keepRows = [];
        const newRows = [];
        let order = 0;
        let fileIndex = 0;

        for (const id of images) {
            if (id === -1) {
                const file = imageFiles[fileIndex++];
                newRows.push({
                    path: `/uploads/posts/${file.filename}`,
                    order: order++,
                });
            } else {
                keepRows.push({ id, order: order++ });
            }
        }

        await db.updatePost(
            postId,
            title,
            location,
            JSON.parse(tagIds),
            description,
            parseFloat(price),
            currency,
            keepRows,
            newRows,
        )

        const keepIds = new Set(keepRows.map(row => row.id));
        const filesToDelete = current.filter(img => !keepIds.has(img.id)).map(img => img.path);

        for (const img_path of filesToDelete) {
            fs.unlink(path.join(__dirname, "..", img_path), err => {
                if (err && err.code !== "ENOENT") console.error("unlink:", err);
            });
        }

        return res.sendStatus(204);
    } catch (err) {
        console.log("Error updating post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

const updatePost = [upload.array("images", 5), handlePostUpdate];

// fixme: adjust to new logic
async function deletePost(req, res, next) {
    try {
        const postId = parseInt(req.params.id);
        const post = await db.getPost(postId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        const oldImages = post.images.map(img => img.path) || [];
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

async function getAllMyPosts(req, res, next) {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const {page = 1, limit = 10} = req.query;
        const offset = (page - 1) * limit;

        const posts = await db.getPostsByUser(userId, parseInt(limit), offset);
        return res.status(200).json(posts);
    } catch (err) {
        console.log("Error fetching my posts:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

async function getMyPost(req, res, next) {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const postId = parseInt(req.params.id);
        const post = await db.getPostByUser(postId, userId);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        return res.status(200).json(post);
    } catch (err) {
        console.log("Error fetching my post:", err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

module.exports = {
    getAllPosts,
    getAllMyPosts,
    getMyPost,
    createPost,
    getPost,
    updatePost,
    deletePost,
    getComments,
    createComment,
    savePostToFavourites,
    removePostFromFavourites
}