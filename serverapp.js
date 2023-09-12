const path = require('path');
const express = require('express');
const body = require('body-parser');

const pagenotfoundController = require('./controllers/pagenotfound');

const sequelize = require('./helpers/databases');

const Product = require('./models/product');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(body.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// store user in request with middleware
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        }
        ).catch(err => {
            console.log(err);
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pagenotfoundController.getPageNotFound);


// apply relationships between user and product
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);


// sync method for add tables for our models in database
sequelize
    //.sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Hassan', email: 'Hassan@test.com' });
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });