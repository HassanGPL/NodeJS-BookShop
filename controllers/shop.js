const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    // return all products in database
    Product.find()
        .then(products => {
            res.render('shop/products-list', {
                products: products,
                Title: 'Products',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
                path: '/',
                isAuthenticated: req.session.isLoggedIn
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
                path: '',
                isAuthenticated: req.session.isLoggedIn
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
                products: user.cart.items,
                isAuthenticated: req.session.isLoggedIn
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
            return req.user
                .addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });

}



exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    console.log(`postCartDeleteProduct : ${productId}`);
    req.user
        .deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}


exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(p => {
                return { quantity: p.quantity, product: { ...p.productId._doc } };
            });
            const order = new Order({
                user: {
                    userId: req.user._id,
                    email: req.user.email
                },
                products: products
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        }).then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}


exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                Title: "Orders",
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}