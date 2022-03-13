//// imports
// import express
const express = require('express');
// import controllers

// declare router
const router = express.Router();

//// router config
// base get route for products
router.get('/', function (req, res) {
  // redirect to products
  res.redirect('/products');
});

// 401 and 403
router.get('/401', function (req, res) {
  res.status(401).render('shared/401');
});
router.get('/403', function (req, res) {
  res.status(403).render('shared/403');
});

//// exports
module.exports = router;
