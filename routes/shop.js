const express = require('express');
const router = express.Router();

const path = require('path');

const rootDirector = require('../helpers/path');

const adminData = require('./admin');

router.get('/', (req, res, next) => {
    const product = adminData.products;
    //res.sendFile(path.join(rootDirector, 'views', 'shop.html'));
    res.render('shop.pug', { prod: product, Title: "Shop", path: '/' });
});


module.exports = router;