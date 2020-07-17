const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('errorMsg', 'not authorized');
    res.redirect('/users/signin');
}

module.exports = helpers;