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

dataPool.getPosts = () => {
    return new Promise ((resolve, reject)=> {
        conn.query("SELECT * FROM Post",  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getPost = (id) => {
    return new Promise ((resolve, reject)=> {
        conn.query("SELECT * FROM Post WHERE id = ?", id,  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.createPost = (title, views, rating, description) => {
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO Post (title, views, rating, description) VALUES (?, ?, ?, ?)", [title, views, rating, description], (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.updatePost = (id, title, views, rating, description) => {
    return new Promise((resolve, reject) => {
        conn.query("UPDATE Post SET title = ?, views = ?, rating = ?, description = ? WHERE id = ?", [title, views, rating, description, id], (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.deletePost = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("DELETE FROM Post WHERE id = ?", id, (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getUsers = () => {
    return new Promise ((resolve, reject)=> {
        conn.query("SELECT * FROM User",  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getUser = (id) => {
    return new Promise ((resolve, reject)=> {
        conn.query("SELECT * FROM User WHERE id = ?", id,  (err,res)=> {
            if(err) return reject(err)
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

// TODO: Update user

dataPool.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        conn.query("DELETE FROM User WHERE id = ?", id, (err, res) => {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

module.exports = dataPool;

