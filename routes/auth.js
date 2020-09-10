var express = require('express');
var router = express.Router();
const passport = require('passport')
const { isLoggedOut } = require('../middleware/auth')

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout()
    res.redirect('/about')
})

router.get('/google', isLoggedOut,
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/about' }),
    async function(req, res) {
        // Successful authentication, redirect home.
        try {
            req.session.user = req.user
            const image = req.session.user.picture
            res.render('addWord', {image});
        } catch(e) {
            console.log(e)
        }
    });

module.exports = router