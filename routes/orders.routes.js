//// imports
// import express
const express = require('express');
// import controllers
const ordersController = require('../controllers/orders.controller');

// declare router
const router = express.Router();

//// router config
// add new order
router.post('/', ordersController.addOrder);
// get orders
router.get('/', ordersController.getOrders);
// handle payment info page
router.get('/success', ordersController.getSuccess);
router.get('/failure', ordersController.getFailure);


//// exports
module.exports = router;