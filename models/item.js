const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: { type: String },
    gallery: { type: [String], validate: [(val) => val.length < 3, '{PATH} exceeds the limit of 3'] },
  }
);
var Item = mongoose.model('Items', ItemSchema);

module.exports = { Item };