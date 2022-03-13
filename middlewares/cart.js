// imports
const Cart = require('../models/cart.model');

// checks if user has a cart or doesn't have one yet

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    // no cart - create cart instance
    cart = new Cart();
  } else {
    // cart exists - take session data
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
  }
  // make it available for all next middlewares
  res.locals.cart = cart;
  next();
}

// exports
module.exports = initializeCart;
