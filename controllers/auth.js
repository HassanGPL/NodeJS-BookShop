const crypto = require('crypto');
const bcrybtjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator')

const User = require('../models/user');

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
        eMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            Title: 'Signup',
            eMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    bcrybtjs
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
        eMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            path: '/login',
            Title: 'Login',
            eMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    Title: 'Login',
                    eMessage: 'Invalid Email or Passowrd...',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: errors.array()
                });
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
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        Title: 'Login',
                        eMessage: 'Invalid Email or Passowrd...',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: errors.array()
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        Title: 'Reset Password',
        eMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', "There is no account with this E-mail")
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpire = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'ahmedhassanmana@gmail.com',
                    subject: 'Reset Password',
                    html:
                        `
                        <h5> You Requested a Password Reset </h5>
                        <p> Click this <a href='http://localhost:3000/reset/${token}'>link</a> to reset your password </p>
                        `
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                Title: 'Update Password',
                eMessage: message,
                userId: user._id.toString(),
                token: token
            });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.postNewPassword = (req, res, next) => {
    const password = req.body.password;
    const userId = req.body.userId;
    const token = req.body.token;
    let resetUser;
    User.findOne({
        _id: userId,
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() }
    })
        .then(user => {
            resetUser = user;
            return bcrybtjs.hash(password, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpire = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
}