//// imports
// import express
const express = require('express');
// import controllers
const productsController = require('../controllers/products.controller');

// declare router
const router = express.Router();

//// router config
// base get route for products
router.get('/products', productsController.getAllProducts);
// get for single product
router.get('/products/:id', productsController.getProductDetails);

//// exports
module.exports = router;