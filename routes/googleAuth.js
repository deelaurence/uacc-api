const express = require("express");
const route = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel')
const { ServerResponse } = require('http')

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/oauth2/redirect/google',
            passReqToCallback: true,
            scope: ['profile', 'email'],
        },
        async function verify(req, accessToken, refreshToken, profile, done) {
            console.error(req.authError);
            try {
                // Check if the user already exists in the database
                const user = await User.findOne({ email: profile.emails[0].value });
                // console.log(profile)
                console.log("finding user")
                console.log(user)
                let newUser
                if (user) {
                    newUser = user
                }
                if (!user) {
                    console.log("creating user " + profile.emails[0].value)
                    // Create a new user
                    newUser = await User.create(
                        {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            // user_id: newUser._id,
                            provider: profile.provider,
                            subject: profile.id,
                        }
                    );


                    return done(null, newUser);
                }

                // User already exists, fetch the user details
                const existingUser = await User.findOne({ _id: newUser._id });
                if (!existingUser) {
                    return done(null, false);
                }

                return done(null, existingUser);
            } catch (error) {
                console.log(error)
                return done(error);
            }
        }
    )
);




//Configure passport serialization and deserialization
//serialize stores unique user info on the sessions (user._id)
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});



route.get('/testauth', () => {
    console.log("test auth")
});
route.get('/testauth', () => {
    console.log("test auth")
});
route.get('/testauth', () => {
    console.log("fail auth")
});
//the route that starts the google auth process
route.get('/login/federated/google', (req, res) => {
    const emptyResponse = new ServerResponse(req)
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, emptyResponse)
    console.log(emptyResponse.getHeader('location'))
    res.json({ message: emptyResponse.getHeader('location') })


})

route.get(
    '/oauth2/redirect/google',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })
);
route.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user.email)
        const user = await User.findOne({ email: req.user.email })
        const token = user.generateJWT(process.env.JWT_SECRET);
        console.log(token)
        if (res.headersSent) {
            console.log('Cookie was set successfully');
        } else {
            console.log('Failed to set cookie');
        }

        res.cookie('token', token, { httpOnly: true, sameSite: "none", secure: true });
        res.redirect(`${process.env.CLIENT_URL}/#/give`)
    } else {
        res.json({ message: 'user unauthenticated' });
    }
});
route.get('/login', (req, res) => {
    res.send('you have to login');
});




module.exports = route;
