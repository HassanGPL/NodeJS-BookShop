exports.getLogin = (req, res, next) => {
    const logged = req.get('Cookie').split('=')[1];
    res.render('auth/login', {
        Title: "Login",
        path: '/login',
        isAuthenticated: logged
    });
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
} 