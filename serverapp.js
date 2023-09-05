const path = require('path');
const express = require('express');
const body = require('body-parser');
const pagenotfoundController = require('./controllers/pagenotfound');
const dbConection = require('./helpers/databases');

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

app.listen(3000);