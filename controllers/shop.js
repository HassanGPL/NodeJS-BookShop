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
    Cart.getCart(cart => {
        Product.fetchAll()
            .then(([rows, fieldData]) => {
                const cartProducts = [];
                rows.forEach(element => {
                    const cartProduct = cart.products.find(prod => prod.id === element.id);
                    if (cartProduct) {
                        cartProducts.push({ cartProduct: element, quantity: cartProduct.quantity });
                    }
                });
                res.render('shop/cart', {
                    Title: "Cart",
                    path: '/cart',
                    products: cartProducts
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
}

exports.postCart = (req, res, next) => {
    const productID = req.body.productID;
    Product.findProductByID(productID, (product) => {
        Cart.addProduct(productID, product.price);
    });
    res.redirect('/cart');
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