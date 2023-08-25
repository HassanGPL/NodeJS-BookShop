const express = require('express');
const router = express.Router();
const path = require('path');
const rootDirector = require('../helpers/path');

var products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', { Title: 'ADD Product', path: '/add-product' });
});

router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;