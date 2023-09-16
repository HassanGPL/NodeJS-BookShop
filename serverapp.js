const { Sequelize, DataTypes } = require('sequelize');

const path = require('path');
const express = require('express');
const body = require('body-parser');

const pagenotfoundController = require('./controllers/pagenotfound');
const mongoConnect = require('./helpers/databases');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// store user in request with middleware
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     }
    //     ).catch(err => {
    //         console.log(err);
    //     });
});


// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(pagenotfoundController.getPageNotFound);

mongoConnect(client => {
    console.log(client);
    app.listen(3000);
});