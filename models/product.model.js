// imports
const mongodb = require('mongodb');
const db = require('../data/database');

// construct Product blueprint
class Product {
  constructor(productData) {
    // store product data
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // force number value
    this.description = productData.description;
    this.image = productData.image; // image name
    this.updateImageData();
    
    // get product id
    if (productData._id) {
      // store product id
      this.id = productData._id.toString();
    }
  }

  // methods
  // find product by id
  static async findById(productId) {
    let prodId;
    // handle error if generating id fails
    try {
          // get product id
    prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    // get product object
    const product = await db.getDB().collection('products').findOne({ _id: prodId });
    // handle error if product does not exist
    if (!product) {
      const error = new Error('Product not found!');
      error.code = 404;
      throw error;
    }
    return new Product(product);
  }
  // find all products - static (we call it on the class itself - not class instance)
  static async findAll() {
    const products = await db.getDB().collection('products').find().toArray(); // return an array
    // return an array map
    return products.map(function(productDocument) {
      return new Product(productDocument);
    });
  }

  // find multiple
  
  static async findMultiple(ids) {
    // pass array of ids into mongobd object
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    // query for products - returns array of product documents
    const products = await db
      .getDB()
      .collection('products')
      .find({ _id: { $in: productIds } }) // $in operator -> finds via given array
      .toArray();

    // return array of product objects
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  // image helper
  updateImageData() {
    // dynamic value from db
    this.imagePath = `product-data/images/${this.image}`;
    // frontend image url
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  // save to db
  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: +this.price,
      description: this.description,
      image: this.image
    };
    // check if we have an id (for update or new prod)
    if (this.id) {
      // update product
      const productId = new mongodb.ObjectId(this.id);
      // check if img == undefined
      if (!this.image) {
        // delete image property
        delete productData.image;
      }
      await db.getDB().collection('products').updateOne({_id: productId}, {
        $set: productData
      });
    } else {
      // new product
      await db.getDB().collection('products').insertOne(productData);
    }
  }
  replaceImage (newImage) {
    this.image = newImage;
    this.updateImageData();
  }
  // remove product from db
  remove() {
    // get product id
    const productId = new mongodb.ObjectId(this.id);
    // delete from db by id
    return db.getDB().collection('products').deleteOne({ _id: productId });
  }
}

module.exports = Product;