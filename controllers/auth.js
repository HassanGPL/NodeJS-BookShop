exports.getLogin = (req, res, next) => {
    // const logged = req.get('Cookie').split('=')[1];
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        Title: "Login",
        path: '/login',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    res.redirect('/');
} 