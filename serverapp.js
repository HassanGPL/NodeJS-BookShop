const path = require('path');
const express = require('express');
const body = require('body-parser');

const pagenotfoundController = require('./controllers/pagenotfound');
const mongoose = require('mongoose');
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
    User.findById('65101d2dac2d4e6f5ef6e8c3')
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

mongoose
    .connect('mongodb+srv://hassan:RCv4mUtefbTAZBOJ@cluster0.ru5cwqx.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        console.log(`CONNECTED SUCCESSFULLY !`);
        User.findOne()
            .then(user => {
                if (!user) {
                    User.create({
                        name: 'Hassan',
                        email: 'Hassan@test.com',
                        cart: {
                            items: []
                        }
                    });
                }
            });

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })