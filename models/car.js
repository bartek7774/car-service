const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const { Owner } = require('./owner');

const one_day = 1000 * 60 * 60 * 24;

let carSchema = Schema({
  _id: Schema.Types.ObjectId,
  model: { type: String, minlength: 3, maxlength: 30 },
  plate: { type: String, minlength: 3, maxlength: 30 },
  deliveryDate: { type: Date, default: Date.now() },
  deadline: { type: Date, default: Date.now() + one_day * 14 },
  cost: { type: Number, default: 0 },
  parts: [{ name: String, onStock: Boolean, price: Number }],
  isFullyDamaged: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'Owner', default: null }
});

let Car = mongoose.model('Car', carSchema);

module.exports = { Car };