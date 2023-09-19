const mongodb = require('mongodb');
const getDb = require('../helpers/databases').getDb;

class Product {
    constructor(title, price, imageUrl, description, _id) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = new mongodb.ObjectId(_id);
    }


    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update Product with _id
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static findById(productId) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectId(productId) }).next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err));
    }

}


// const Product = sequelize.define('product', {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     title: {
//         type: DataTypes.STRING
//     },
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

module.exports = Product;