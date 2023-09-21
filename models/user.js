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


    getCart() {
        const db = getDb();
        // mapping cart items to be [ Ids ]
        const productsIds = this.cart.items.map(p => {
            return p.productId;
        })

        return db.collection('products')
            // find products with the same Ids
            .find({ _id: { $in: productsIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(p2 => {
                            return p._id.toString() === p2.productId.toString();
                        }).quantity
                    }
                })
            })

    }


    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: this._id,
                        username: this.username,
                        email: this.email
                    }
                }
                return db.collection('orders').insertOne(order);
            })
            .then(result => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } });
            })
            .catch(err => {
                console.log(err);
            })
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
            .find({ 'user._id': this._id })
            .toArray()
            .then(orders => {
                return orders.map(o => {
                    return {
                        _id: o._id,
                        items: o.items
                    }
                })
            })
    }


    deleteItemFromCart(productId) {
        const cartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

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