const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    // return all products in database
    Product.find({ userId: req.user._id })
        // .select('title price')
        // .populate('userId', 'name')
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
        edit: false,
        hasError: false,
        eMessage: null,
        validationErrors: []
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('admin/edit-product', {
            Title: "Add Product",
            path: '/admin/add-product',
            edit: false,
            hasError: true,
            eMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: imageUrl,
                description: description,
                price: price
            },
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user
    });

    // Add a new product to database
    product.save()
        .then(result => {
            console.log('CREATED SUCCESSFULLY !');
            res.redirect('/admin/products');
        }).catch(err => {
            // return res.status(500).render('admin/edit-product', {
            //     Title: "Add Product",
            //     path: '/admin/add-product',
            //     edit: false,
            //     hasError: true,
            //     product: {
            //         title: title,
            //         imageUrl: imageUrl,
            //         description: description,
            //         price: price
            //     },
            //     eMessage: 'Database operation failed, please try again later...',
            //     validationErrors: []
            // });
            return res.redirect('/500');
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
                hasError: false,
                eMessage: null,
                validationErrors: []
            });
        }).catch(err => console.log(err));
}


exports.postEditProduct = (req, res, next) => {
    // catch data from request
    const productID = req.body.ID;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            Title: "Edit Product",
            path: '/admin/edit-product',
            edit: true,
            hasError: true,
            eMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                description: updatedDescription,
                price: updatedPrice,
                _id: productID
            },
            validationErrors: errors.array()
        });
    }

    Product.findById(productID)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save().then(result => {
                console.log("UPDATED SUCCESSFULLY!")
                res.redirect('/admin/products');
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteProduct = (req, res, next) => {

    // Get product ID from request
    const productID = req.body.productID;

    // delete product in database
    Product.deleteOne({ _id: productID, userId: req.user._id })
        .then(result => {
            console.log(result);
            console.log("DELETED SUCCESSFULLY!")
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}