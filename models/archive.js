const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Story } = require('./story');

let historySchema = Schema({
  _id: Schema.Types.ObjectId,
  story: { type: Schema.Types.ObjectId, ref: 'Story' },
  state: {
    type: String,
    enum: ['new', 'toRevise', 'revised', 'approved', 'refused']
  },
  title: { type: String, minlength: 3, maxlength: 30 },
  content: { type: String, minlength: 10, maxlength: 500 },
  user: { type: String, default: null },
  supervisor: { type: String, default: null },
  date: { type: Date, default: Date.now }
});

let Archive = mongoose.model('Archive', historySchema);

module.exports = { Archive };