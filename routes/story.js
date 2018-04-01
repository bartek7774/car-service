const mongoose = require('mongoose');
const router = require('express').Router();
const jwtAuthz = require('express-jwt-authz');
const { jwtCheck } = require('../helpers/security/auth');
const { ObjectID } = require('mongodb');
const { autoUpload } = require('../helpers/images/upload');

const { Story } = require('./../models/story');

// GET stories (public)
router.get('/stories', (req, res) => {
  Story.find({}).then((stories) => {
    if (!stories) {
      return res.status(404).send();
    }
    res.send(stories);
  }).catch(e => res.status(400).send());
});

// GET info details by rank (private)
router.get('/stories/:id', (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();
  Story.findOne({
    _id: id,
  }).then((story) => {
    if (!story) {
      return res.status(404).send();
    }
    res.send(story);
  }).catch(e => res.status(400).send());
});

// POST create new info
// jwtCheck, jwtAuthz(['create:info'])
router.post('/stories', autoUpload(), (req, res) => {
  // const uid = req.user.sub;
  const uid = 'sub-123';
  console.log(req.files);
  let body = { 
    title: req.body.title, 
    content: req.body.content, 
    gallery: req.files.slice().map(file => file.path),
    uid };
  let story = new Story({ _id: new mongoose.Types.ObjectId(), ...body });
  story.save().then((story) => {
    res.send(story);
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

// // DELETE delete info with specific id
// // jwtCheck, jwtAuthz(['delete:info']), 
// router.delete('/stories/:id', async (req, res) => {
//   try {
//     let id = req.params.id;
//     // if (!ObjectID.isValid(id)) throw new Error(404);
//     let story = await Story.findOneAndRemove({ _id: id });
//     if (!story) {
//       throw new Error(404);
//     }
//     res.send(story);
//   } catch (e) {
//     res.status(e.message).send();
//   }
// });

// // PATCH update info
// //jwtCheck, jwtAuthz(['update:info']),
// router.patch('/stories/:id',  (req, res) => {
//   let id = req.params.id * 1;
//   const uid = req.user.sub;
//   let body = { title: req.body.title, content: req.body.content, uid, lastModified: Date.now() };
//   // if (!ObjectID.isValid(id)) return res.status(404).send();
//   Story.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
//     .then((story) => {
//       if (!story) return res.status(404).send();
//       res.send(story);
//     }).catch((e) => res.status(404).send());
// });

module.exports = router;