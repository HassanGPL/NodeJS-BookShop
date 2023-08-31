const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        Title: "Add Product",
        path: '/admin/add-product',
        edit: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const productID = req.params.productID;
    Product.findProductByID(productID, product => {
        res.render('admin/edit-product', {
            Title: "Edit Product",
            path: '/admin/edit-product',
            product: product,
            edit: editMode,
        });

    });
}

exports.postEditProduct = (req, res, next) => {
    // 1 - catch data from request 
    const id = req.body.ID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    // 2 - create a new product 
    const updatedProduct = new Product(id, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);

    // 3 edit 
    updatedProduct.save();
    res.redirect('/admin/products');
}


exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', { products: products, Title: "Admin Products", path: '/admin/products' });
    });
}