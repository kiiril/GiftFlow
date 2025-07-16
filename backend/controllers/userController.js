const path = require("path");
const db = require("../db/dbConn");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "..", "uploads", "avatars");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.session.user_id
        const ext = path.extname(file.originalname);
        const uniqueName = `${userId}${ext}`;
        cb(null, uniqueName);
    },
});

// Only accept JPEG/PNG/GIF under 2MB
const fileFilter = (req, file, cb) => {
    const allowedMime = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMime.includes(file.mimetype)) {
        return cb(new Error("Only JPEG/PNG/GIF images are allowed"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

async function handleUserUpdate(req, res, next) {
    try {
        const userId = req.session.user_id;
        const { username, date_of_birthday, location, gender, bio } = req.body;
        const avatarFile = req.file; // set by multer if an “avatar” file was uploaded

        let avatarUrl;
        if (avatarFile) {
            avatarUrl = `/uploads/avatars/${avatarFile.filename}`;

            const oldUser = await db.getUserById(userId);
            const oldAvatar = oldUser?.avatar_url;
            if (oldAvatar) {
                const oldPath = path.join(__dirname, "..", oldAvatar);
                fs.unlink(oldPath, err => {
                    if (err && err.code !== "ENOENT") {
                        console.error("Failed to delete old avatar:", err);
                    }
                });
            }
        }

        const oldUser = await db.getUserById(userId);

        await db.updateUser(
            userId,
            username ?? oldUser.username,
            date_of_birthday ?? oldUser.date_of_birthday,
            location ?? oldUser.location,
            gender ?? oldUser.gender,
            bio ?? oldUser.bio,
            avatarFile ? avatarUrl : oldUser.avatar_url
        );

        const updatedUser = await db.getUserById(userId);
        delete updatedUser.password;
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        return res
            .status(500)
            .json({ message: "An error occurred while updating profile." });
    }
}

const updateUser = [upload.single("avatar"), handleUserUpdate];

async function getUser(req, res, next){
    try {
        const userId = req.session.user_id;
        const user = await db.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    updateUser,
    getUser,
};