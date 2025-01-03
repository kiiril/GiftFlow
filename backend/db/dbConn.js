const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

conn.connect((err) => {
    if(err) {
        console.log("Error with db connection: " + err.message);
        return;
    }
    console.log("Connection established");
});


const dataPool = {}

// POSTS
dataPool.getPosts = (limit, offset) => {
    // fixme: decide if no tags are allowed
    return new Promise((resolve, reject)=> {
        conn.query("SELECT p.*, JSON_ARRAYAGG(JSON_OBJECT('name', t.name, 'color', t.color)) AS tags FROM Post p LEFT JOIN Post_x_Tag pt ON p.id = pt.post_id LEFT JOIN Tag t ON pt.tag_id = t.id GROUP BY p.id, p.title LIMIT ? OFFSET ?", [limit, offset], (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getPost = (id) => {
    // fixme: decide if no tags are allowed
    return new Promise((resolve, reject)=> {
        const query = `
            SELECT 
                p.*, 
                JSON_ARRAYAGG(JSON_OBJECT('name', t.name, 'color', t.color)) AS tags,
                JSON_OBJECT(
                    'username', u.username,
                    'avatar_url', u.avatar_url
                ) AS publisher_info
            FROM Post p
            LEFT JOIN Post_x_Tag pt ON p.id = pt.post_id 
            LEFT JOIN Tag t ON pt.tag_id = t.id
            LEFT JOIN User u ON p.user_id = u.id
            WHERE p.id = ? 
            GROUP BY p.id, p.title, u.username, u.avatar_url
        `;

        conn.query(query, [id],  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createPost = (user_id, title, description, imageUrls, price) => {
    return new Promise((resolve, reject) => {
        const imageUrlsJson = JSON.stringify(imageUrls);
        conn.query(
            "INSERT INTO Post (user_id, title, description, image_urls, price) VALUES (?, ?, ?, ?, ?)",
            [user_id, title, description, imageUrlsJson, price],
            (err, res) => {
                if (err) return reject(err)
                return resolve(res);
            }
        );
    });
}

dataPool.updatePost = (post_id, title, description, imageUrls, price) => {
    return new Promise((resolve, reject) => {
        const imageUrlsJson = JSON.stringify(imageUrls);

        conn.query(
            "UPDATE Post SET title = ?, description = ?, image_urls = ?, price = ? WHERE id = ?",
            [title, description, imageUrlsJson, price, post_id],
            (err, res) => {
                if (err) return reject(err);
                return resolve(res);
            }
        );
    });
};

dataPool.deletePost = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("DELETE FROM Post WHERE id = ?", id, (err, res) => {
            if(err) return reject(err)
            return resolve(res);
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

        conn.query(query, [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

dataPool.createPostComment = (id, user_id, content) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO Comment (user_id, post_id, content) VALUES (?, ?, ?)",
            [user_id, id, content],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

module.exports = dataPool;



// COMMENTS
dataPool.getComments = (limit, offset) => {
    return new Promise((resolve, reject)=> {
        conn.query("SELECT * FROM Comment LIMIT ? OFFSET ?", [limit, offset], (err, res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getComment = (id) => {
    return new Promise((resolve, reject)=> {
        conn.query("SELECT * FROM Comment WHERE id = ?", id, (err, res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createComment = (userId, postId, parentCommentId, content) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO Comment (user_id, post_id, parent_comment_id, content) VALUES (?, ?, ?, ?)",
            [userId, postId, parentCommentId, content],
            (err, res) => {
                if(err) return reject(err)
                return resolve(res);
            }
        )
    })
}
// update and delete comment?


// USERS
dataPool.getUser = (id) => {
    return new Promise((resolve, reject)=> {
        conn.query("SELECT * FROM User WHERE id = ?", id,  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM User WHERE email = ?", email, (err, res) => {
            if (err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createUser = (email, password) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO User (email, password) VALUES (?, ?)", [email, password], (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.updateUser = (id, name, surname, dateOfBirthday, location, gender)=> {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE User SET name = ?, surname = ?, date_of_birthday = ?, location = ?, gender = ? WHERE id = ?",
            [name, surname, dateOfBirthday, location, gender, id],
            (err, res) => {
                if(err) return reject(err)
                return resolve(res);
        });
    });
}

dataPool.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("DELETE FROM User WHERE id = ?", id, (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

module.exports = dataPool;

