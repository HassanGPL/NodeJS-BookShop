const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { Title: 'ADD Product', path: '/add-product' });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll();
    res.render('shop', { products: products, Title: "Shop", path: '/' });
}