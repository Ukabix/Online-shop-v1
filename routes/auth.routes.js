//// imports
// import express
const express = require('express');
// import controllers
const authController = require('../controllers/auth.controller');

// declare router
const router = express.Router();

//// router config
// register signup route with controller
router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup);

// register login route with controller
router.get('/login', authController.getLogin);

// post route for login
router.post('/login', authController.login);

// post route for logout
router.post('/logout', authController.logout);

//// exports
module.exports = router;