// imports
const Product = require('./product.model');

// construct Cart class
class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }
  // methods
  async updatePrices() {
    // get product ids via map - returns array
    const productIds = this.items.map(function (item) {
      return item.product.id;
    });
    // query products
    const products = await Product.findMultiple(productIds);
    // create empty array of ids for deletion
    const deletableCartItemProductIds = [];
    // loop cart items to compare cart and db product ids
    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id; // returns bool if this is the product searched for
      });
      // no match - (product is in cart, not in db)
      if (!product) {
        // product was deleted!
        // 'schedule' for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id);
        continue;
      }
      // match
      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }
    // if we have deletable items
    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0; // return new array
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    // initial cart item
    let cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price
    };

    // push product to array if this is the 1st push of this product to array
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // check if product is stored by id
      if (item.product.id === product.id) {
        // if true
        cartItem.quantity = +item.quantity + 1;
        cartItem.totalPrice = item.totalPrice + product.price;
        // replace with updated cart item
        this.items[i] = cartItem;
        this.totalQuantity++;
        this.totalPrice = this.totalPrice + product.price;
        return;
      }
    }
    // no product in cart - push product
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {
    // find item to clear 
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      // check if product is stored by id && check if quantity is > 0
      if (item.product.id === productId && newQuantity > 0) {
        // helper consts
        const cartItem = { ...item };
        const quantityChange = newQuantity - item.quantity;
        cartItem.quantity = newQuantity;
        // if true
        cartItem.quantity = newQuantity;
        cartItem.totalPrice = newQuantity * item.product.price;
        // replace with updated cart item
        this.items[i] = cartItem;

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price;
        return { updatedItemPrice: cartItem.totalPrice };
      } else if (item.product.id === productId && newQuantity <= 0) {
        // if quantity is <= 0 - remove cart item
        this.items.splice(i, 1);
        this.totalQuantity = this.totalQuantity - item.quantity;
        this.totalPrice -= item.totalPrice;
        return { updatedItemPrice: 0 };
      }
    }

  }
}

// exports
module.exports = Cart;