const mongoose = require('mongoose');
const { subscribe } = require('../Routes/auth');
const { objectId } = mongoose.Schema;

const userShema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: 'subscriber',
    },
    cart: {
      type: Array,
      default: [],
    },
    adress: String,
    //wishlist: [{ type: objectId, ref: 'product'}],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userShema);
