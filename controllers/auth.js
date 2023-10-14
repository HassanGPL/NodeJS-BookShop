const bcrybtjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const auth = require('../middlewares/auth');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        Title: 'Signup',
        eMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error', 'This user already exist...');
                return res.redirect('/signup');
            }
            return bcrybtjs
                .hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return newUser.save();
                })
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'ahmedhassanmana@gmail.com',
                        subject: 'Signup',
                        html: '<h1>You successfully signed up !</h1>'
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        Title: "Login",
        path: '/login',
        eMessage: message
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash('error', 'Invalid Email or Passowrd...');
                return res.redirect('/login');
            }
            bcrybtjs.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid Email or Passowrd...');
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                });

        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}