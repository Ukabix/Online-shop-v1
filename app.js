//// imports
// import env
const env = require('./variables');
// path for diff OS
const path = require('path');
// import express
const express = require('express');
// import csurf
const csrf = require('csurf');
// import express session
const expressSession = require('express-session');
// import session config
const createSessionConfig = require('./config/session');
// import mongo
const db = require('./data/database');
// import middlewares
// import csrf 
const addCsrfTokenMiddleware = require('./middlewares/csrf');
// import error handler
const errorHandlerMiddleware = require('./middlewares/error-handler');
// auth check
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
// auth and isAdmin check for route protection
const protectRoutes = require('./middlewares/protect-routes');
// cart middleware
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
// 404
const notFoundMiddleware = require('./middlewares/not-found');
// import routes
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

//// execute block
// execute express as app
const app = express();
// setup ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// execute middlewares
// static publics
app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
// urlencoded for form submit
app.use(express.urlencoded({ extended: false }));
// extract json
app.use(express.json());
// session 
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
// csurf for csrf security
app.use(csrf());
app.use(addCsrfTokenMiddleware);
// activate cart
app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);
// check auth
app.use(checkAuthStatusMiddleware);
// register routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
// cart routes
app.use('/cart', cartRoutes);
// admin routes with filter path - !'.admin/' part path removed from admin.routes.js
app.use('/admin', protectRoutes, adminRoutes);
// orders
app.use('/orders', protectRoutes, ordersRoutes); // /orders
// 404 handler
app.use(notFoundMiddleware);
// error handler
app.use(errorHandlerMiddleware);


// connect to db
db.connectToDatabase()
  // if successful - spin server on port 3000
  .then(function () {
    app.listen(env.port);
  })
  // if not successful - throw error
  .catch(function (error) {
    console.log('Failed to connect to database!');
    console.log(error);
  });
