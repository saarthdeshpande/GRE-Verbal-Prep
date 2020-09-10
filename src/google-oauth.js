const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user')

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK
    },
     function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ email: profile._json.email}, async function (err, user) {
            user = await User.findOneAndUpdate({ email: profile._json.email }, { picture: profile._json.picture }, {new: true})
            return done(err, user);
        });
    }
));