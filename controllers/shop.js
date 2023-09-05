const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/products-list', {
                products: rows,
                Title: "Products",
                path: '/products'
            })
        }
        ).catch(err => {
            console.log(err);
        });

}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findProductByID(productID)
        .then(([product]) => {
            res.render('shop/product-details', {
                product: product[0],
                Title: product.title,
                path: ''
            });
        })
        .catch(err => console.log(err));
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
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                products: rows,
                Title: "Shop",
                path: '/'
            });
        })
        .catch(err => {
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