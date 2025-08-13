const mysql = require("mysql2/promise");
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

// fixme: adjust all functions to async/await
const dataPool = {}
dataPool.getPosts = async (limit, offset, tagIds = [], locationStrings = [], minPrice, maxPrice) => {
    let query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(t.id)
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tagIds,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', sub.id, 'path', sub.path))
                    FROM (
                        SELECT pi.id, pi.path
                        FROM PostImages AS pi
                        WHERE pi.post_id = p.id
                        ORDER BY pi.display_order
                    ) AS sub
                ) AS images,
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
        `;

    const whereClauses = [];
    const queryParams = [];

    // Only show published posts in the main feed
    whereClauses.push(`p.is_published = 1`);

    if (tagIds && tagIds.length > 0) {
        whereClauses.push(`
            p.id IN (
                SELECT post_id
                FROM Post_x_Tag
                WHERE tag_id IN (?)
                GROUP BY post_id
                HAVING COUNT(DISTINCT tag_id) = ?
            )
        `);
        queryParams.push(tagIds, tagIds.length);
    }

    if (locationStrings && locationStrings.length > 0) {
        whereClauses.push(`p.location IN (?)`);
        queryParams.push(locationStrings);
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        whereClauses.push(`p.price >= ?`);
        queryParams.push(parseFloat(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        whereClauses.push(`p.price <= ?`);
        queryParams.push(parseFloat(maxPrice));
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    query += ` ORDER BY p.posted_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
        const [rows] = await pool.query(query, queryParams);
        return rows;
    } catch (err) {
        console.error("Error fetching posts:", err);
        throw err;
    }
}

dataPool.getPost = async (id) => {
    const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(t.id)
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tagIds,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', sub.id, 'path', sub.path))
                    FROM (
                        SELECT pi.id, pi.path
                        FROM PostImages AS pi
                        WHERE pi.post_id = p.id
                        ORDER BY pi.display_order
                    ) AS sub
                ) AS images,
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
    try {
        const [rows] = await pool.query(query, [id]);
        // fixme: add check for empty?
        return rows[0];
    } catch (err) {
        console.error("Error fetching post:", err);
        throw err;
    }
}

const _insertTags = async (conn, postId, tagIds = []) => {
    if (!Array.isArray(tagIds) || tagIds.length === 0) return;
    const values = tagIds.map(tagId => [postId, tagId]);
    await conn.query(
        "INSERT INTO Post_x_Tag (post_id, tag_id) VALUES ?",
        [values]
    );
}

const _replaceTags = async (conn, postId, tagIds = []) => {
    await conn.query("DELETE FROM Post_x_Tag WHERE post_id = ?", [postId]);
    await _insertTags(conn, postId, tagIds);
}

const _insertImages = async (conn, postId, imageUrls = []) => {
    if (imageUrls.length === 0) return;
    const rows = imageUrls.map((url, idx) => [postId, url, idx]);
    await conn.query(
        "INSERT INTO PostImages (post_id, path, display_order) VALUES ?",
        [rows]
    );
}

const _replaceImages = async (conn, postId, imageUrls = []) => {
    await conn.query("DELETE FROM PostImages WHERE post_id = ?", [postId]);
    await _insertImages(conn, postId, imageUrls);
}

dataPool.createPost = async (
    userId,
    title,
    location,
    tagIds,
    description,
    price,
    currency,
    imageUrls
) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [postRes] = await conn.execute(
            `INSERT INTO Post
         (user_id, title, location, description, price, currency, posted_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [userId, title, location, description, price, currency]
        );
        const postId = postRes.insertId;

        await _insertTags(conn, postId, tagIds);
        await _insertImages(conn, postId, imageUrls);

        await conn.commit();
        return postId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

dataPool.updatePost = async (
    postId,
    title,
    location,
    tagIds,
    description,
    price,
    currency,
    keepRows,
    newRows,
) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.execute(
            `UPDATE Post SET title = ?, location = ?, description = ?, price = ?, currency = ? WHERE id = ?`,
            [title, location, description, price, currency, postId]
        );
        await _replaceTags(conn, postId, tagIds);

        const keepIds = keepRows.map(row => row.id);
        await conn.query(
            keepIds.length
                ? `DELETE FROM PostImages WHERE post_id = ? AND id NOT IN (?)`
                : `DELETE FROM PostImages WHERE post_id = ?`,
            keepIds.length ? [postId, keepIds] : [postId]
        );

        // reorder existing images
        for (const r of keepRows) {
            await conn.execute(
                `UPDATE PostImages SET display_order = ? WHERE id = ? AND post_id = ?`,
                [r.order, r.id, postId]
            );
        }

        // insert new images
        if (newRows.length > 0) {
            const values = newRows.map(r => [postId, r.path, r.order]);
            await conn.query(
                `INSERT INTO PostImages (post_id, path, display_order) VALUES ?`,
                [values]
            );
        }

        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

dataPool.getPostImages = async (postId) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, path, display_order FROM PostImages WHERE post_id = ? ORDER BY display_order`,
            [postId]
        );
        return rows;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

dataPool.deletePost = async (id) => {
    try {
        await pool.query("DELETE FROM Post WHERE id = ?", id);
    } catch (err) {
        console.error(err);
        throw err
    }
}

dataPool.savePostToFavourites = async (post_id, user_id) => {
    try {
        const [res] = await pool.query("INSERT INTO PostLikes (post_id, user_id) VALUES (?, ?)", [post_id, user_id]);
        console.log(res)
        return res;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.removePostFromFavourites = async (post_id, user_id) => {
    try {
        const [res] = await pool.query("DELETE FROM PostLikes WHERE post_id = ? AND user_id = ?", [post_id, user_id]);
        console.log("Removed from favourites:", res);
        return res;
        // fixme: return smth?
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getPostComments = async (id) => {
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
    try {
        const [rows] = await pool.query(query, [id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

dataPool.createPostComment = async (id, user_id, content) => {
    try {
        const [rows] = await pool.query("INSERT INTO Comment (user_id, post_id, content) VALUES (?, ?, ?)", [user_id, id, content]);
        return rows
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.isPostSavedByUser = async (post_id, user_id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM PostLikes WHERE post_id = ? AND user_id = ?", [post_id, user_id]);
        return rows.length > 0;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getPostsByUser = async (userId, limit, offset) => {
    const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(t.id)
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tagIds,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', sub.id, 'path', sub.path))
                    FROM (
                        SELECT pi.id, pi.path
                        FROM PostImages AS pi
                        WHERE pi.post_id = p.id
                        ORDER BY pi.display_order
                    ) AS sub
                ) AS images,
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
    try {
        const [rows] = await pool.query(query, [userId, limit, offset]);
        return rows;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

dataPool.getPostByUser = async (postId, userId) => {
    const query = `
            SELECT
                p.*,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT('label', t.label, 'color', t.color, 'value', t.value)
                    )
                    FROM Post_x_Tag AS pt
                    JOIN Tag AS t ON pt.tag_id = t.id
                    WHERE pt.post_id = p.id
                ) AS tags,
                (
                    SELECT JSON_ARRAYAGG(sub.path)
                    FROM (
                        SELECT pi.path
                        FROM PostImages AS pi
                        WHERE pi.post_id = p.id
                        ORDER BY pi.display_order
                    ) AS sub
                ) AS images
            FROM Post AS p
            LEFT JOIN User AS u ON p.user_id = u.id
            WHERE p.id = ? AND p.user_id = ?
        `;
    try {
        const [rows] = await pool.query(query, [postId, userId]);
        // fixme: check for empty
        return rows[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}


// COMMENTS
// fixme: not needed, remove?
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
dataPool.getUserById = async (id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM User WHERE id = ?", id);
        // fixme: check for empty
        const user = rows[0];
        const dateOfBirthday = user.date_of_birthday;
        const date = dateOfBirthday.getDate();
        const month = dateOfBirthday.getMonth() + 1; // months are zero-based
        const year = dateOfBirthday.getFullYear();
        user.date_of_birthday = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
        return user
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getUserByEmail = async (email) => {
    try {
        const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", email);
        return rows[0];
    } catch(err) {
        console.error(err);
        throw err;
    }
}

dataPool.createUser = async (username, email, password, avatarUrl) => {
    try {
        const [rows] = await pool.query("INSERT INTO User (username, email, password, avatar_url) VALUES (?, ?, ?, ?)", [username, email, password, avatarUrl]);
        // fixme: what return?
    } catch(err) {
        console.error(err);
        throw err;
    }
}

dataPool.updateUser = async (id, username, dateOfBirthday, location, gender, bio, avatarUrl) => {
    try {
        const [rows] = await pool.query(
            "UPDATE User SET username = ?, date_of_birthday = ?, location = ?, gender = ?, bio = ?, avatar_url = ? WHERE id = ?",
            [username, dateOfBirthday, location, gender, bio, avatarUrl, id]
        );
        // fixme: what return?
    } catch(err) {
        console.error(err);
        throw err;
    }
}

dataPool.deleteUser = async (id) => {
    try {
        const[rows] = await pool.query("DELETE FROM User WHERE id = ?", id);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getTags = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM Tag");
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getLocations = async () => {
    const query = `
        SELECT CONCAT(co.name, ', ', ci.name) as locations from Countries as co
        JOIN Cities ci on ci.country_id = co.id 
        ORDER BY co.name, ci.name
    `;
    try {
        const [rows] = await pool.query(query);
        return rows.map(row => row.locations);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.getLocationsTree = async () => {
    try {
        const [rows] = await pool.query(`
          SELECT co.name AS country,
                 ci.name AS city
          FROM   Countries co
          JOIN   Cities    ci ON ci.country_id = co.id
          ORDER  BY co.name, ci.name
        `);

        const countryTree = [];
        let current = null;

        for (const { country, city } of rows) {
            // new country?
            if (!current || current.id !== country) {
                current = { id: country, label: country, children: [] };
                countryTree.push(current);
            }
            // add city
            current.children.push({ id: city, label: city });
        }
        return countryTree;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

dataPool.togglePostPublication = async (postId) => {
    try {
        // First get the current publication status
        const [rows] = await pool.query(
            "SELECT is_published FROM Post WHERE id = ?",
            [postId]
        );

        if (rows.length === 0) {
            throw new Error("Post not found");
        }

        const currentStatus = rows[0].is_published;
        const newStatus = !currentStatus;

        // Update the publication status
        await pool.query(
            "UPDATE Post SET is_published = ? WHERE id = ?",
            [newStatus, postId]
        );

        return { is_published: newStatus };
    } catch (err) {
        console.error("Error toggling post publication:", err);
        throw err;
    }
}

module.exports = dataPool;
