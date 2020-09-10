

const isLoggedIn = (req, res, next) => {
    if (req.session.passport) {
        return next();
    } else {
        return res.redirect('/about')
    }
}

const isLoggedOut = (req, res, next) => {
    if (!req.session.passport) {
        return next();
    } else {
        return res.redirect('/')
    }
}

module.exports = { isLoggedIn, isLoggedOut }