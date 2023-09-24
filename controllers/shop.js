const Product = require('../models/product');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
    // return all products in database
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                products: products,
                Title: 'Products',
                path: '/products'
            });
        }).catch(err => {
            console.log(err);
        });

}

exports.getIndex = (req, res, next) => {

    // return all products in database
    Product.find()
        .then(products => {
            res.render('shop/index', {
                products: products,
                Title: "Shop",
                path: '/'
            });
        }).catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;

    // return specific product in database
    Product.findById(productID)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                Title: product.title,
                path: ''
            });
        }).catch(err => {
            console.log(err);
        });

}

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            res.render('shop/cart', {
                Title: "Cart",
                path: '/cart',
                products: user.cart.items
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    Product.findById(productID)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

}



exports.postDeleteProduct = (req, res, next) => {
    const prodID = req.body.productId;
    req.user
        .deleteItemFromCart(prodID)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}


exports.postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}


exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                Title: "Orders",
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
}




// // exports.getCheckout = (req, res, next) => {
// //     res.render('shop/checkout', { Title: "Checkout", path: '/checkout' });
// // }
