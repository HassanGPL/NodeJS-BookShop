const mongodb = require('mongodb');
const getDb = require('../helpers/databases').getDb;

class User {
    constructor(username, email, _id, cart) {
        this.username = username;
        this.email = email;
        this._id = _id;
        this.cart = cart;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    addToCart(product) {
        let cartItems = [...this.cart.items];

        const cartProductIndex = this.cart.items.findIndex((p) => {
            return p.productId.toString() === product._id.toString();
        });

        if (cartProductIndex >= 0) {
            cartItems[cartProductIndex].quantity++;
        } else {
            cartItems.push({ productId: product._id, quantity: 1 })
        }

        const db = getDb();
        const updatedCart = { items: cartItems };
        return db
            .collection('users')
            .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }

}

module.exports = User;