const path = require('path');
const express = require('express');
const body = require('body-parser');
const pagenotfoundController = require('./controllers/pagenotfound');
const sequelize = require('./helpers/databases');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pagenotfoundController.getPageNotFound);

// sync method for add tables for our models in database
sequelize.sync()
    .then(result => {
        // console.log(result);
        app.listen(3000);
    }).catch(err => {
        // console.log(err);
    });