const fs = require('fs');
const path = require('path');
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

    static findProductByID(id, cb) {
        getDataFromFile((products) => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }

}