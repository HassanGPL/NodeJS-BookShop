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
    constructor(title) {
        this.title = title;
    }

    save() {
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

}