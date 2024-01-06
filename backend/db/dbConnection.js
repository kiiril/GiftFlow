const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
conn.connect((err) => {
    if(err){
        console.log("ERROR: " + err.message);
        return;
    }
    console.log('Connection established');
});


const dataPool = {}
// multiple arguments for SQL query should be taken into brackets, like []

dataPool.authUser = (username) => {
    return new Promise ((resolve, reject)=>{
        conn.query(`SELECT * FROM User WHERE username = ?`, username,  (err,res)=>{
            if(err) {return reject(err)}
            return resolve(res);
        });
    });
};


module.exports = dataPool;


