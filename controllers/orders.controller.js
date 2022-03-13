/// handles order submission
// imports
const env = require('../variables');
const stripe = require('stripe')(env.stripeSk);
const Order = require('../models/order.model');
const User = require('../models/user.model');

// functions

async function getOrders (req, res, next) {
  try {
    // get user orders with session
    const orders = await Order.findAllForUser(res.locals.uid);
    // render page
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  // access cart via session data
  const cart = res.locals.cart;
  // get user document
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  // construct order
  const order = new Order(cart, userDocument);
  // save order
  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }
  // clear cart from session
  req.session.cart = null;
  //// charge setup
  // session
  const session = await stripe.checkout.sessions.create({
    // map cart item into an array for stripe
    line_items: cart.items.map(function(item){
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: env.stripeSuccessUrl, // TO DO
    cancel_url: env.stripeCancelUrl, // TODO
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}


// exports
module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure: getFailure
}