const fs = require('fs');
const path = require('path');

// Get file path of cart.json
const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {

    static addProduct(id, price) {

        // Fetch the previous cart
        fs.readFile(filePath, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // Analyze the cart : Find existing Product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            // Add new product or increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.quantity += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, quantity: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +price;

            // Write new data in cart JSON file
            fs.writeFile(filePath, JSON.stringify(cart), (err) => {
                console.log(err);
            });

        });

    }

    static deleteProduct(id, price) {

        // Fetch the previous cart
        fs.readFile(filePath, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };

            // Catch the product to delete
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQTY = product.quantity;

            // Delete product from products array in the cart
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);

            // Update total price
            updatedCart.totalPrice = updatedCart.totalPrice - (price * productQTY);

            // Write new data in cart JSON file
            fs.writeFile(filePath, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(filePath, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }

}