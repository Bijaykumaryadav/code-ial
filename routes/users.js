const express = require("express");
const router = express.Router();
const Passport = require("passport");
const usersController = require("../controllers/users_controller");


// Corrected route for the "profile" endpoint
router.get(
  "/profile/:id",
  Passport.checkAuthentication,
  usersController.user_profile
);

router.get("/sign_up", usersController.signUp);
router.get("/sign_in", usersController.signIn);

router.post("/create", usersController.create);
//use passport as a middleware to authenticate
router.post(
  "/create-session",
  Passport.authenticate("local", { failureRedirect: "/users/sign_in" }),
  usersController.createSession
);

router.get('/sign_out',usersController.destroySession);

module.exports = router;
