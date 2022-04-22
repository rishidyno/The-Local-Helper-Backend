const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied.');
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (err) {
        res.status(400).json({status: 0, message: err});
    }
};

module.exports = auth;