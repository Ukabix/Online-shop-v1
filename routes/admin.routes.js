//// imports
// import express
const express = require('express');
// import controllers
const adminController = require('../controllers/admin.controller');
// import middlewares
const imageUploadMiddleware = require('../middlewares/image-upload');

// declare router
const router = express.Router();

//// router config
// base get route for product management
router.get('/products', adminController.getProducts);
// base get route for new product
router.get('/products/new', adminController.getNewProduct);
// register post route for new product with multer middleware
router.post('/products', imageUploadMiddleware, adminController.createNewProduct);
// register get/post route for product update
router.get('/products/:id', adminController.getUpdateProduct);
router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);
// register route for product delete
router.delete('/products/:id', adminController.deleteProduct);
// order routes
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id', adminController.updateOrder);

//// exports
module.exports = router;