const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ownerSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, minlength: 3, maxlength: 30 },
  surname:  { type: String, minlength: 3, maxlength: 30 },
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }]
});

let Owner = mongoose.model('Owner', ownerSchema);

module.exports = { Owner };