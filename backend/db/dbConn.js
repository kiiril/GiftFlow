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
    return new Promise ((resolve, reject)=>{
        conn.query("SELECT * FROM Post",  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

dataPool.getPost = (id) => {
    return new Promise ((resolve, reject)=>{
        conn.query("SELECT * FROM Post WHERE id = ?", id,  (err,res)=> {
            if(err) return reject(err)
            return resolve(res);
        });
    });
}

module.exports = dataPool;

