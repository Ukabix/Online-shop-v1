// imports
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// functions for admin actions
async function getProducts (req, res, next) {
  // get products
  try {
    // if sucessfull
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct (req, res) {
  res.render('admin/products/new-product');
}

async function createNewProduct (req, res, next) {
  // create product
  const product = new Product({
    ...req.body,
    image: req.file.filename
  });
  // call save
  try {
    await product.save(); 
  } catch (error) {
    next(error);
    return;
  }
  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  // get product by id
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product });
  } catch (error) {
    next(error);    
  }
}

async function updateProduct(req, res, next) {
  // create product
  const product = new Product({
    ...req.body,
    _id: req.params.id
  });
  // if image is passed
  if (req.file) {
    // replace img
    product.replaceImage(req.file.filename);
  }

  // call save
  try{
    await product.save();
  } catch (error) {
    next(error);
    return;
  }
  
  res. redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  // create product instance
  let product;
  try {
    product = await Product.findById(req.params.id);
      await product.remove();
  } catch (error) {
    return next(error);
  }
  res.json({ message: 'Deleted a product' });
}

async function getOrders(req, res, next) {
  try {
    // query orders
    const orders = await Order.findAll();
    // pass query to render
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  // get order id
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    // query order by id
    const order = await Order.findById(orderId);
    // set new status
    order.status = newStatus;
    // save changes
    await order.save();
    // send response
    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

// exports
module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
}