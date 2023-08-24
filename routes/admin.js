const express = require('express');
const router = express.Router();
const path = require('path');
const rootDirector = require('../helpers/path');

var products = [];

router.get('/add-product', (req, res, next) => {
    //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
    //res.sendFile(path.join(rootDirector, 'views', 'add-product.html'));
    res.render('add-product.pug', { Title: 'ADD Product', path: '/add-product' });
});

router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    // res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
    res.redirect('/');
    //res.sendFile(path.join(rootDirector, 'views', 'shop.html'));
});

exports.routes = router;
exports.products = products;