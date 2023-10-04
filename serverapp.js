const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const body = require('body-parser');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);

const pagenotfoundController = require('./controllers/pagenotfound');
const User = require('./models/user');

const app = express();
const store = new mongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

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

// store user in request with middleware
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        }
        ).catch(err => {
            console.log(err);
        });

});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(pagenotfoundController.getPageNotFound);

mongoose
    .connect(process.env.MONGO_URI)
    .then(result => {
        console.log(`CONNECTED SUCCESSFULLY !`);
        User.findOne()
            .then(user => {
                if (!user) {
                    User.create({
                        name: 'Hassan',
                        email: 'Hassan@test.com',
                        cart: {
                            items: []
                        }
                    });
                }
            });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })