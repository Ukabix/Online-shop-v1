// imports
const db = require('../data/database');
const mongodb = require('mongodb');

// create order blueprint
class Order {
  // statuses: pending, fulfulled, cancelled
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
          this.formattedDate = this.date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
    }
    this.id = orderId;
  }

  // methods

  // orders formatter
  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  // orders mapper
  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDB()
      .collection('orders')
      .find()
      .sort({ _id: -1 }) // descending
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);

    const orders = await db
      .getDB()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 }) // -1 descencing
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDB()
      .collection('orders')
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  save() {
    // check if new or existing order
    if (this.id) {
      // updating an order
      const orderId = new mongodb.ObjectId(this.id);
      return db
        .getDB()
        .collection('orders')
        .updateOne(
          { _id: orderId }, 
          { $set: { status: this.status } });
    } else {
      // new order
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status
      };
      // write to db
      return db.getDB().collection('orders').insertOne(orderDocument);
    }
  }
}

// exports
module.exports = Order;