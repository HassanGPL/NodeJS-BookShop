const dbConection = require('../helpers/databases');
const Cart = require('./cart');


module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        return dbConection.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]);
    }

    static fetchAll() {
        return dbConection.execute('SELECT * FROM products');
    }

    static deleteProductByID(id) { }

    static findProductByID(id) {
        return dbConection.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }

}