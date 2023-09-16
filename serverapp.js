const { Sequelize, DataTypes } = require('sequelize');

const path = require('path');
const express = require('express');
const body = require('body-parser');

const pagenotfoundController = require('./controllers/pagenotfound');

// const sequelize = require('./helpers/databases');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// store user in request with middleware
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     }
    //     ).catch(err => {
    //         console.log(err);
    //     });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pagenotfoundController.getPageNotFound);


// // apply relationship between user and product
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);

// // apply relationship between user and cart
// User.hasOne(Cart);
// Cart.belongsTo(User);

// // apply relationship between cart and product
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// //apply relationship between user and order
// User.hasMany(Order);
// Order.belongsTo(User);

// //apply relationship between user and order
// Order.belongsToMany(Product, { through: OrderItem });
// Product.belongsToMany(Order, { through: OrderItem });


// sync method for add tables for our models in database
// sequelize
//     // .sync({ force: true })
//     .sync()
//     .then(result => {
//         return User.findByPk(1);
//     })
//     .then(user => {
//         if (!user) {
//             // create user 1
//             return User.create({ name: 'Hassan', email: 'Hassan@test.com' });
//         }
//         return user;
//     })
//     // .then(user => {
//     //     // create cart for user 1
//     //     Cart.destroy({
//     //         where: {
//     //             id: {
//     //                 [Sequelize.Op.gt]: 1
//     //             }
//     //         },
//     //     });
//     //     return user.createCart();
//     // })
//     .then(user => {
//         app.listen(3000);
//     })
//     .catch(err => {
//         console.log(err);
//     });