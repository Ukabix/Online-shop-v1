// imports
const bcrypt = require("bcryptjs");
const db = require("../data/database");
const mongodb = require("mongodb");

// construct user class
class User {
  constructor(
    email,
    password,
    fullname,
    street,
    postal,
    city
  ) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  // create signup method to db
  async signup() {
    // pass hashing
    const hashedPassword = await bcrypt.hash(
      this.password,
      12
    );
    // write to db
    await db
      .getDB()
      .collection("users")
      .insertOne({
        email: this.email,
        password: hashedPassword,
        name: this.name,
        address: this.address,
      });
  }

  static findById(userId) {
    // get id
    const uid = new mongodb.ObjectId(userId);
    // query
    return db.getDB()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } }); // pass 0 == pass excluded

  }

  // method to check if user exists
  getUserWithSameEmail() {
    return db
      .getDB()
      .collection("users")
      .findOne({
        email: this.email,
      });
  }

  // method to return bool if user exists
  async existsAlready() {
    const existingUser =
      await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  // method to check if pass matches
  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(
      this.password,
      hashedPassword
    );
  }
}

// exports
module.exports = User;
