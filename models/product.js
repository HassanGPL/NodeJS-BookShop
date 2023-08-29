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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = Math.random().toString();
        getDataFromFile((products) => {
            products.push(this);
            fs.writeFile(filePath, JSON.stringify(products), (err) => {
                console.log(err);
            });
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