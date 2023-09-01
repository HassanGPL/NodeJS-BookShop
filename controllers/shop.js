const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/products-list', { products: products, Title: "Products", path: '/products' });
    });
}

exports.getProduct = (req, res, next) => {
    const productID = req.params.productID;
    Product.findProductByID(productID, product => {
        res.render('shop/product-details', { product: product, Title: product.title, path: '' });
    });
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll((products) => {
            const cartProducts = [];
            products.forEach(element => {
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
    Product.fetchAll((products) => {
        res.render('shop/index', { products: products, Title: "Shop", path: '/' });
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