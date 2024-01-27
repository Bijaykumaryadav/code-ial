const express = require("express");
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/post_controller');

router.post('/create', passport.checkAuthentication ,postsController.create);

module.exports = router;