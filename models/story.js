const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { State } = require('./state');

let storySchema = Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, minlength: 3, maxlength: 30 },
  content: { type: String, minlength: 10, maxlength: 500 },
  gallery: { type: [String], validate: [(val) => val.length < 3, '{PATH} exceeds the limit of 3'] },
  created: { type: Date, default: Date.now },
  state: { type: Schema.Types.ObjectId, ref: 'State', default: null },
  uid: { type: String, required: true }
});

storySchema.post('save', async (doc) => {
  let state = (await Story.findOne({ state: doc.state }).populate('state')).state;
  if (!state) {
    state = await new State({ _id: new mongoose.Types.ObjectId(), story: doc._id, name: 'new' }).save();
    doc.state = state._id;
    await doc.save();
  }
});

storySchema.post('findOneAndUpdate', async (doc) => {
  let state = (await Story.findOne({ state: doc.state }).populate('state')).state;
  if (state) {
    if (state.name === 'toRevise') {
      state.name = 'revised';
      await state.save();
    }
  }
});

let Story = mongoose.model('Story', storySchema);

module.exports = { Story };