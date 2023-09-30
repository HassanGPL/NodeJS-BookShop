exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        Title: "Login",
        path: '/login'
    });
} 