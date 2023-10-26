exports.getPageNotFound = (req, res, next) => {
    res.status(404).render('pagenotfound', {
        Title: 'Error 404 !',
        path: '/404',
        isAuthenticated: false
    });
}

// exports.error500 = (req, res, next) => {
//     res.status(500).render('500', {
//         Title: 'Error',
//         path: '/500',
//         isAuthenticated: false
//     });
// }