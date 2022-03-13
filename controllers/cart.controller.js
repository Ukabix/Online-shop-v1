// imports
const Product = require('../models/product.model');

// functions

function getCart(req, res) {
  res.render('customer/cart/cart'); // all data from session
}

async function addCartItem(req, res, next) {
  let product;
  // get product from db
  try {
    product = await Product.findById(
      req.body.productId
    );
  } catch (error) {
    next(error);
    return;
  }
  const cart = res.locals.cart;
  // get cart data from session, call addItem method on product
  cart.addItem(product);
  // save updated cart to session
  req.session.cart = cart;
  // send json res for ajax
  res.status(201).json({
    message: 'Cart updated!',
    // get val for total items in cart
    newTotalItems: cart.totalQuantity,
  });
}

function updateCartItem(req, res) {
  const cart = res.locals.cart;
  // call update item method on cart
  const updatedItemData = cart.updateItem(
    req.body.productId,
    +req.body.quantity
  );
  // save to session
  req.session.cart = cart;
  // since this is ajax, send json res
  res.json({
    message: 'Item updated',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice:
        updatedItemData.updatedItemPrice,
    },
  });
}

// exports
module.exports = {
  addCartItem: addCartItem,
  getCart: getCart,
  updateCartItem: updateCartItem,
};
