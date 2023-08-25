const express = require('express');
const body = require('body-parser');

const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');



const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).render('pagenotfound', { Title: 'Error 404 !' });
});

app.listen(3000);