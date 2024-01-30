const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//authentication using passport
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     function(email,password,done){
//         //find the user and establish the identity
//         User.findOne({email: email},function(err , user) {
//             if (err){
//                 console.log('Error in finding user --> Passport');
//                 return done(err);
//             }
//             if (!user || user.password != password) {
//                 console.log('Invalid Username/Password');
//                 return done(null , false);
//             }
//             return done(null , user);
//         });
//     }
// ));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // Find the user using promises
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
          // If user not found or password is incorrect, return done with an error
          req.flash("error","Invalid Username/Password");
          console.log("Invalid Username/Password");
          return done(null, false);
        }

        // If user is found and password is correct, return done with the user object
        return done(null, user);
      } catch (err) {
        // Handle errors
        req.flash("error", err);
        console.log("Error in finding user --> Passport", err);
        return done(err);
      }
    }
  )
);

//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing the user from the key in the cookies
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     if (err) {
//       console.log("Error in finding user --> Passport");
//     }
//     return done(null, user);
//   });
// });
passport.deserializeUser(async function (id, done) {
  try {
    // Find the user using promises
    const user = await User.findById(id);

    if (!user) {
      // If user not found, return done with an error
      console.log("User not found during deserialization");
      return done(null, false);
    }

    // If user is found, return done with the user object
    return done(null, user);
  } catch (err) {
    // Handle errors
    console.log("Error in finding user during deserialization", err);
    return done(err);
  }
});
//check if the user is authenticate
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in, then pass on the request to the next funnction(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if the user is not signed in
  return res.redirect("/users/sign_in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //res.user contains the current signed in user from th session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }

  next();
};

module.exports = passport;
