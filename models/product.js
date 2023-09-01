const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getDataFromFile = (cb) => {
    fs.readFile(filePath, (e, fileContent) => {
        if (e) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}


module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getDataFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(p => p.id === this.id);
                const updatedproducts = [...products];
                updatedproducts[existingProductIndex] = this;
                fs.writeFile(filePath, JSON.stringify(updatedproducts), (err) => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(filePath, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getDataFromFile(cb);
    }

    static deleteProductByID(id) {
        getDataFromFile((products) => {
            // Find The product to delete
            const product = products.find(p => p.id === id);
            // Delete the product from products array 
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
                if (!err) {
                    // Delete product from the cart
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    static findProductByID(id, cb) {
        getDataFromFile((products) => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

}