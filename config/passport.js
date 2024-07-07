const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email }, (err, user) => {

        if (err) return done(err);
        if (!user) return done(null, false, { message: 'No user with that email' });

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        });
    });
}));

passport.use(new GoogleStrategy({
    clientID: '473576599230-85i1n7hfa7u6pupcb1ufcns8uva6118l.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/user/auth/google/callback',
     scope: ['profile', 'email'],
    prompt: 'select_account'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if a user with the same email already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // If user exists but googleId is not set, link Google account
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
        } else {
            // If user doesn't exist, create a new user
            user = new User({
                fullname: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                image: profile.photos[0].value,
                role: 'user'
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
