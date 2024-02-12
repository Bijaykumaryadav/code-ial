const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require("../models/user");

//tell passport to use a strategy for login
passport.use(
  new googleStrategy(
    {
      clientID:
        "344866940962-dqe6m6tt4dnc0eruui4sjt1vdlq6ohtc.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      // Note the use of async keyword
      try {
        // Find a user
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If found, set this user as req.user
          return done(null, user);
        } else {
          // If not found, create the user and set it as req.user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          console.log(profile);
          return done(null, user);
        }
      } catch (err) {
        console.log("Error in google strategy-passport", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
