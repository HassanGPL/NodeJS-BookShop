const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        Title: 'Signup',
        isAuthenticated: false
    });
};

exports.postSignup = (req, res, next) => { };

exports.getLogin = (req, res, next) => {
    // const logged = req.get('Cookie').split('=')[1];
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        Title: "Login",
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    User.findById('65101d2dac2d4e6f5ef6e8c3')
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}