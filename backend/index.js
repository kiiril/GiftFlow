const express = require("express");
const app = express();
require("dotenv").config()
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");
const port = 8108;

const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const tags = require("./routes/tags");
const locations = require("./routes/locations");
const auth = require("./routes/auth");

// MySQL session store configuration
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes
    expiration: 86400000, // 24 hours
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
});

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // server static files, TODO restrict from everyone, organise structure

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods:["GET", "POST", "PUT", "DELETE"],
    origin: process.env.NODE_ENV === "production" ? true : "http://localhost:3108",
    credentials: true,
}))
app.use(cookieParser(process.env.SESSION_SECRET));
app.set('trust proxy', 1);
app.use(session({
    key: 'giftflow_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    },
}));

app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/tags", tags);
app.use("/api/locations", locations);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
