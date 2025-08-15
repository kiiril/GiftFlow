function isAuthenticated(req, res, next) {
    console.log('Session check:', {
        sessionExists: !!req.session,
        sessionId: req.sessionID,
        userId: req.session?.user_id,
        cookie: req.session?.cookie
    });

    if (req.session && req.session.user_id) {
        return next(); // User is authenticated, proceed to the next middleware/route
    }
    return res.status(401).json({ message: "Unauthorized access. Please log in." });
}

module.exports = isAuthenticated;