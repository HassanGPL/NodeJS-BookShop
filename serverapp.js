const { Sequelize, DataTypes } = require('sequelize');

const path = require('path');
const express = require('express');
const body = require('body-parser');

const pagenotfoundController = require('./controllers/pagenotfound');
const mongoConnect = require('./helpers/databases').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// store user in request with middleware
app.use((req, res, next) => {
    User.findById('650ac6c740a0c8b22ce2b844')
        .then(user => {
            req.user = new User(user.username, user.email, user._id, user.cart);
            next();
        }
        ).catch(err => {
            console.log(err);
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pagenotfoundController.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});