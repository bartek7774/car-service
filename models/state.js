const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { Story } = require('./story');
const { Archive } = require('./archive');

let stateSchema = Schema({
  _id: Schema.Types.ObjectId,
  story: { type: Schema.Types.ObjectId, ref: 'Story' },
  name: {
    type: String,
    enum: ['new', 'toRevise', 'revised', 'approved', 'refused']
  },
  uid: { type: String, default: null },
  checked: { type: Date, default: Date.now }
});

stateSchema.pre('findOneAndUpdate', async function (next) {
  // console.log('beforeUpdate', this._update.$set);
  let { '$set': { name: newName } } = this._update;
  let old = await this.findOne({ _id: this._conditions._id });
  if (!['new', 'revised'].includes(old.name)) return next(new Error('Bad state.'));
  if (!['approved', 'toRevise', 'refused'].includes(newName))  return next(new Error('Bad state.'));
  next();
});

stateSchema.post('save', async (doc) => {
  let state_actual = await State.findOne({ story: doc.story }).populate('story');
  if (state_actual) {
    new Archive({
      _id: new mongoose.Types.ObjectId(),
      story: state_actual.story._id,
      state: doc.name,
      title: state_actual.story.title,
      content: state_actual.story.content,
      user: state_actual.story.uid,
      supervisor: doc.uid,
    }).save();
  }
});

stateSchema.post('findOneAndUpdate', async (doc) => {
  // console.log('findOneAndUpdate', doc);
  let state_actual = await State.findOne({ story: doc.story }).populate('story');
  console.log(state_actual);
  if (state_actual) {
    new Archive({
      _id: new mongoose.Types.ObjectId(),
      story: state_actual.story._id,
      state: doc.name,
      title: state_actual.story.title,
      content: state_actual.story.content,
      user: state_actual.story.uid,
      supervisor: doc.uid,
    }).save();
  }
});

let State = mongoose.model('State', stateSchema);

module.exports = { State };