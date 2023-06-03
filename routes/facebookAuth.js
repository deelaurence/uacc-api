const express = require('express');
const FacebookStrategy = require('passport-facebook').Strategy;
const route = express.Router();
const passport = require('passport');
const User = require('../models/UserModel')
const { ServerResponse } = require('http')
// Initialize the Express route



// Initialize passport middleware
route.use(passport.initialize());
route.use(passport.session());

// Configure the Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: 'your-route-id',
    clientSecret: 'your-route-secret',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
},
    function (accessToken, refreshToken, profile, done) {
        // Handle the user authentication logic here
        // You can find the user details in the 'profile' object
        // Call 'done' with the user object to complete the authentication process
        // Example:
        // const user = {
        //   id: profile.id,
        //   name: profile.displayName,
        //   email: profile.emails[0].value
        // };
        // return done(null, user);
    }
));

// Define the routes
route.get('/auth/facebook', passport.authenticate('facebook'));
route.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));



module.exports = route;