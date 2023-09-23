const Product = require('../models/product');


exports.getAdminProducts = (req, res, next) => {
    // return all products in database
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products: products,
                Title: "Admin Products",
                path: '/admin/products'
            });
        }).catch(err => {
            console.log(err);
        });
}

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

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price
    });

    // Add a new product to database
    product.save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const productID = req.params.productID;

    // return specific product in database
    Product.findById(productID)
        .then(product => {
            if (!product) {
                return res.render('/');
            }
            res.render('admin/edit-product', {
                Title: "Edit Product",
                path: '/admin/edit-product',
                product: product,
                edit: editMode,
            });
        }).catch(err => console.log(err));
}


exports.postEditProduct = (req, res, next) => {
    // catch data from request
    const _id = req.body.ID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, _id);
    // update product data in database
    product.save()
        .then(result => {
            console.log("UPDATED SUCCESSFULLY!")
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {

    // Get product ID from request
    const productID = req.body.productID;

    // delete product in database
    Product.deleteById(productID)
        .then(result => {
            console.log("DELETED SUCCESSFULLY!")
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}