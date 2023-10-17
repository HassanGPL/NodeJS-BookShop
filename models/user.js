const mongoose = require('mongoose');
// const Product = require('./product');
// const Order = require('./order');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    resetToken: String,
    resetTokenExpire: Date,
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    let cartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex((p) => {
        return p.productId.toString() === product._id.toString();
    });

    if (cartProductIndex >= 0) {
        cartItems[cartProductIndex].quantity++;
    } else {
        cartItems.push({ productId: product._id, quantity: 1 })
    }

    const updatedCart = { items: cartItems };
    this.cart = updatedCart;
    return this.save()
}


userSchema.methods.deleteItemFromCart = function (productId) {
    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });

    this.cart.items = cartItems;
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}


module.exports = mongoose.model('User', userSchema);