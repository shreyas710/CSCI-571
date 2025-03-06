const session = require('express-session');

const sessionMiddleware = session({
    secret: 'shreyas710assignment3',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
});

module.exports = sessionMiddleware;