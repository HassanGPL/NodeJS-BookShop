const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const body = require('body-parser');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const pagenotfoundController = require('./controllers/pagenotfound');
const User = require('./models/user');

const app = express();
const store = new mongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(body.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'Faculty of Computer and Information Sciences - Ain Shams University',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

// store user in request with middleware
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });

});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(pagenotfoundController.error500);
app.use(pagenotfoundController.getPageNotFound);

mongoose
    .connect(process.env.MONGO_URI)
    .then(result => {
        console.log(`CONNECTED SUCCESSFULLY !`);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })