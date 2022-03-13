//// imports
// import express
const express = require('express');
// import controllers
const cartController = require('../controllers/cart.controller');

// declare router
const router = express.Router();

//// router config
// 
router.get('/', cartController.getCart); // '/cart/'
// post route -// path to '/cart' declared in app.js
router.post('/items', cartController.addCartItem);
// update cart data with data item
router.patch('/items', cartController.updateCartItem);

//// exports
module.exports = router;