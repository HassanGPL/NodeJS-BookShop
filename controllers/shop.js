const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {

    // return all products in database
    Product.findAll()
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

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;

    // return specific product in database
    Product.findByPk(productID)
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

    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                Title: "Cart",
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    let foundedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            foundedCart = cart;
            return cart.getProducts({ where: { id: productID } });
        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
            }

            return Product.findByPk(productID);
        })
        .then(product => {
            return foundedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}


exports.getIndex = (req, res, next) => {

    // return all products in database
    Product.findAll().then(products => {
        res.render('shop/index', {
            products: products,
            Title: "Shop",
            path: '/'
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { Title: "Checkout", path: '/checkout' });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { Title: "Orders", path: '/orders' });
}

exports.postDeleteProduct = (req, res, next) => {
    const productID = req.body.productID;
    Product.findProductByID(productID, product => {
        Cart.deleteProduct(productID, product.price);
        res.redirect('/cart');
    });
}