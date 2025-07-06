const mysql = require("mysql2");
const {data} = require("express-session/session/cookie");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const dataPool = {}

// POSTS
// dataPool.getPosts = (limit, offset) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             SELECT
//                   p.*,
//                   (
//                     SELECT JSON_ARRAYAGG(pi.url)
//                     FROM PostImage AS pi
//                     WHERE pi.post_id = p.id
//                   ) AS image_urls,
//
//                   (
//                     SELECT JSON_ARRAYAGG(
//                              JSON_OBJECT('name', t.name, 'color', t.color)
//                            )
//                     FROM Post_x_Tag AS pt
//                     JOIN Tag AS t ON pt.tag_id = t.id
//                     WHERE pt.post_id = p.id
//                   ) AS tags,
//
//                   JSON_OBJECT(
//                     'username', u.username,
//                     'avatar_url', u.avatar_url
//                   ) AS publisher_info
//
//                 FROM Post AS p
//                 LEFT JOIN User AS u
//                   ON p.user_id = u.id
//                 LIMIT ? OFFSET ?
//         `;
//         pool.query(query, [limit, offset], (err, res) => {
//             if (err) return reject(err)
//             return resolve(res);
//         });
//     });
// }

// dataPool.getPost = (id) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             SELECT
//                   p.*,
//                   (
//                     SELECT JSON_ARRAYAGG(pi.url)
//                     FROM PostImage AS pi
//                     WHERE pi.post_id = p.id
//                   ) AS image_urls,
//
//                   (
//                     SELECT JSON_ARRAYAGG(
//                              JSON_OBJECT('name', t.name, 'color', t.color)
//                            )
//                     FROM Post_x_Tag AS pt
//                     JOIN Tag AS t ON pt.tag_id = t.id
//                     WHERE pt.post_id = p.id
//                   ) AS tags,
//
//                   JSON_OBJECT(
//                     'username', u.username,
//                     'avatar_url', u.avatar_url
//                   ) AS publisher_info
//
//                 FROM Post AS p
//                 LEFT JOIN User AS u
//                   ON p.user_id = u.id
//                 WHERE p.id = ?
//         `;
//
//         pool.query(query, [id], (err, res) => {
//             if (err) return reject(err)
//             return resolve(res);
//         });
//     });
// }

// dataPool.createPost = async (
//     userId,
//     title,
//     location,
//     tagIds,
//     description,
//     price,
//     imageUrls
// ) => {
//     // 1) Grab a connection from the pool
//     let connection;
//     try {
//         connection = await pool.promise().getConnection();
//     } catch (connErr) {
//         throw connErr;
//     }
//
//     try {
//         // 2) Start the transaction
//         await connection.beginTransaction();
//
//         // 3) Insert into Post table
//         const insertPostSql = `
//             INSERT INTO Post (user_id, title, location, description, price)
//             VALUES (?, ?, ?, ?, ?)
//          `;
//         const [postResult] = await connection.query(insertPostSql, [
//             userId,
//             title,
//             location,
//             description,
//             price
//         ]);
//         const postId = postResult.insertId;
//
//         // Insert images
//         if (Array.isArray(imageUrls) && imageUrls.length > 0) {
//             const insertImagesSql = `INSERT INTO PostImage (post_id, url, position) VALUES ?`;
//             const imageValues = imageUrls.map((url, i) => [postId, url, i]);
//             await connection.query(insertImagesSql, [imageValues]);
//         }
//
//         // 4) Insert into Post_x_Tag (if there are any tagIds)
//         if (Array.isArray(tagIds) && tagIds.length > 0) {
//             // Build [[postId, tagId], [postId, tagId], …]
//             const tagValues = tagIds.map((tagId) => [postId, tagId]);
//
//             const insertTagsSql = `INSERT INTO Post_x_Tag (post_id, tag_id) VALUES ?`;
//             await connection.query(insertTagsSql, [tagValues]);
//         }
//
//         // 5) Commit the transaction
//         await connection.commit();
//
//         // 6) Release the connection back to the pool
//         connection.release();
//
//         // 7) Return the new post’s ID
//         return postId;
//     } catch (err) {
//         // If anything goes wrong, roll back
//         try {
//             await connection.rollback();
//         } catch (_) {
//             // ignore rollback errors
//         }
//         connection.release();
//         throw err;
//     }
// };

dataPool.getPosts = (limit, offset) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('name', t.name, 'color', t.color)
                    )
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tags,
                JSON_OBJECT(
                    'username', u.username,
                    'avatar_url', u.avatar_url
                ) AS publisher_info,
                (
                    SELECT COUNT(*)
                    FROM PostLikes AS pl
                    WHERE pl.post_id = p.id
                ) AS like_count,
                (
                    SELECT COUNT(*)
                    FROM Comment AS c
                    WHERE c.post_id = p.id
                ) AS comment_count,
                (
                    SELECT COUNT(*)
                    FROM PostShares AS ps
                    WHERE ps.post_id = p.id
                ) AS shares_count
            FROM Post AS p
            LEFT JOIN User AS u ON p.user_id = u.id
            LIMIT ? OFFSET ?
        `;
        pool.query(query, [limit, offset], (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getPost = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('name', t.name, 'color', t.color)
                    )
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tags,
                JSON_OBJECT(
                    'username', u.username,
                    'avatar_url', u.avatar_url
                ) AS publisher_info,
                (
                    SELECT COUNT(*)
                    FROM PostLikes AS pl
                    WHERE pl.post_id = p.id
                ) AS like_count,
                (
                    SELECT COUNT(*)
                    FROM PostShares AS ps
                    WHERE ps.post_id = p.id
                ) AS shares_count
            FROM Post AS p
            LEFT JOIN User AS u ON p.user_id = u.id
            WHERE p.id = ?
        `;

        pool.query(query, [id], (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createPost = async (
    userId,
    title,
    location,
    tagIds,
    description,
    price,
    imageUrls
) => {
    return new Promise((resolve, reject) => {
        const imageUrlsJson = JSON.stringify(imageUrls);

        pool.query(
            "INSERT INTO Post (user_id, title, location, description, price, image_urls) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, title, location, description, price, imageUrlsJson],
            (err, res) => {
                if (err) return reject(err);
                const postId = res.insertId;

                if (Array.isArray(tagIds) && tagIds.length > 0) {
                    const tagValues = tagIds.map(tagId => [postId, tagId]);
                    pool.query(
                        "INSERT INTO Post_x_Tag (post_id, tag_id) VALUES ?",
                        [tagValues],
                        (err) => {
                            if (err) return reject(err);
                            return resolve(postId);
                        }
                    );
                } else {
                    return resolve(postId);
                }
            }
        );
    });
};

dataPool.updatePost = (post_id, title, location, tagIds, description, price, imageUrls) => {
    return new Promise((resolve, reject) => {
        const imageUrlsJson = JSON.stringify(imageUrls);

        pool.query(
            "UPDATE Post SET title = ?, location = ?, description = ?, price = ?, image_urls = ? WHERE id = ?",
            [title, location, description, price, imageUrlsJson, post_id],
            (err, res) => {
                if (err) return reject(err);

                if (Array.isArray(tagIds) && tagIds.length > 0) {
                    const tagValues = tagIds.map(tagId => [post_id, tagId]);
                    pool.query("DELETE FROM Post_x_Tag WHERE post_id = ?", [post_id], (err) => {
                        if (err) return reject(err);

                        if (tagValues.length > 0) {
                            pool.query(
                                "INSERT INTO Post_x_Tag (post_id, tag_id) VALUES ?",
                                [tagValues],
                                (err) => {
                                    if (err) return reject(err);
                                    return resolve(res);
                                }
                            );
                        } else {
                            return resolve(res);
                        }
                    });
                } else {
                    return resolve(res);
                }
            }
        );
    });
};

dataPool.deletePost = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Post WHERE id = ?", id, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.savePostToFavourites = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO PostLikes (post_id, user_id) VALUES (?, ?)", [post_id, user_id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

dataPool.removePostFromFavourites = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM PostLikes WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

dataPool.getPostComments = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                c.id,
                c.content,
                c.created_at,
                JSON_OBJECT(
                    'id', u.id,
                    'username', u.username,
                    'avatar_url', u.avatar_url
                ) AS user_info,
                c.parent_comment_id,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', cc.id,
                            'content', cc.content,
                            'created_at', cc.created_at,
                            'user_info', JSON_OBJECT(
                                'id', cu.id,
                                'username', cu.username,
                                'avatar_url', cu.avatar_url
                            ),
                            'parent_comment_id', cc.parent_comment_id
                        )
                    )
                    FROM Comment cc
                    LEFT JOIN User cu ON cc.user_id = cu.id
                    WHERE cc.parent_comment_id = c.id
                ) AS child_comments
            FROM Comment c
            LEFT JOIN User u ON c.user_id = u.id
            WHERE c.post_id = ?
            AND c.parent_comment_id IS NULL;
        `;

        pool.query(query, [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

dataPool.createPostComment = (id, user_id, content) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Comment (user_id, post_id, content) VALUES (?, ?, ?)",
            [user_id, id, content],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

dataPool.isPostSavedByUser = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM PostLikes WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, res) => {
            if (err) return reject(err);
            resolve(res.length > 0); // Returns true if the post is saved by the user
        });
    });
}

dataPool.getPostsByUser = (userId, limit, offset) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('name', t.name, 'color', t.color)
                    )
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tags,
                JSON_OBJECT(
                    'username', u.username,
                    'avatar_url', u.avatar_url
                ) AS publisher_info,
                (
                    SELECT COUNT(*)
                    FROM PostLikes AS pl
                    WHERE pl.post_id = p.id
                ) AS like_count,
                (
                    SELECT COUNT(*)
                    FROM Comment AS c
                    WHERE c.post_id = p.id
                ) AS comment_count,
                (
                    SELECT COUNT(*)
                    FROM PostShares AS ps
                    WHERE ps.post_id = p.id
                ) AS shares_count
            FROM Post AS p
            LEFT JOIN User AS u ON p.user_id = u.id
            WHERE p.user_id = ?
            LIMIT ? OFFSET ?
        `;
        pool.query(query, [userId, limit, offset], (err, res) => {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}


// COMMENTS
dataPool.getComments = (limit, offset) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Comment LIMIT ? OFFSET ?", [limit, offset], (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getComment = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Comment WHERE id = ?", id, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createComment = (userId, postId, parentCommentId, content) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO Comment (user_id, post_id, parent_comment_id, content) VALUES (?, ?, ?, ?)",
            [userId, postId, parentCommentId, content],
            (err, res) => {
                if (err) return reject(err)
                return resolve(res);
            }
        )
    })
}
// update and delete comment?


// USERS
dataPool.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM User WHERE id = ?", id, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM User WHERE email = ?", email, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createUser = (username, email, password, avatarUrl) => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO User (username, email, password, avatar_url) VALUES (?, ?, ?, ?)", [username, email, password, avatarUrl], (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.updateUser = (id, username, dateOfBirthday, location, gender, bio, avatarUrl) => {
    console.log("date", dateOfBirthday)
    return new Promise((resolve, reject) => {
        pool.query("UPDATE User SET username = ?, date_of_birthday = ?, location = ?, gender = ?, bio = ?, avatar_url = ? WHERE id = ?",
            [username, dateOfBirthday, location, gender, bio, avatarUrl, id],
            (err, res) => {
                if (err) return reject(err)
                return resolve(res);
            });
    });
}

dataPool.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM User WHERE id = ?", id, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getTags = () => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Tag", (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getLocations = () => {
    // todo: optimize for performance (pagination)
    const query = `
        SELECT
            r.id AS id,
            r.name AS label,
            r.countries_json AS children
        FROM RegionSorted r
    `;
    return new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

module.exports = dataPool;

