const mongoose = require('mongoose');
const router = require('express').Router();
const jwtAuthz = require('express-jwt-authz');
const { jwtCheck } = require('../helpers/security/auth');
const { ObjectID } = require('mongodb');

const { Archive } = require('./../models/archive');

// GET archives (public)
router.get('/archives', (req, res) => {
  Archive.find({}).then((archives) => {
    if (!archives) {
      return res.status(404).send();
    }
    res.send(archives);
  }).catch(e => res.status(400).send());
});

// GET archive - how state has been changed over the time for specific story
router.get('/archives/:id', (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();

  Archive.find({ story: id }).sort('-date')
    .then((archives) => {
      if (!archives) {
        return res.status(404).send();
      }
      res.send(archives);
    }).catch(e => res.status(400).send());
});

// GET archive - how state has been changed over the time for specific story
router.get('/archives/:id', (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();

  Archive.find({ story: id }).sort('-date')
    .then((archives) => {
      if (!archives) {
        return res.status(404).send();
      }
      res.send(archives);
    }).catch(e => res.status(400).send());
});

// GET archive - how state has been changed over the time for specific story
router.get('/archives/:id/:state', (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();

  let _state = req.params.state.trim().toLowerCase();
  Archive.find({ story: id }).where('state').equals(_state).sort('-date')
    .then((archives) => {
      if (!archives) {
        return res.status(404).send();
      }
      res.send(archives);
    }).catch(e => res.status(400).send());
});

// // POST create new info
// // jwtCheck, jwtAuthz(['create:info'])
// router.post('/infos', (req, res) => {
//   // const uid = req.user.sub;
//   const uid = 'sub-123';
//   let body = { title: req.body.title, content: req.body.content, uid };
//   let info = new Info({ _id: new mongoose.Types.ObjectId(), ...body });
//   info.save().then((info) => {
//     res.send(info);
//   }, (e) => {
//     console.log(e);
//     res.status(400).send(e);
//   });
// });

// // DELETE delete info with specific id
// // jwtCheck, jwtAuthz(['delete:info']), 
// router.delete('/infos/:id', async (req, res) => {
//   try {
//     let id = req.params.id;
//     // if (!ObjectID.isValid(id)) throw new Error(404);
//     let info = await Info.findOneAndRemove({ _id: id });
//     if (!info) {
//       throw new Error(404);
//     }
//     res.send(info);
//   } catch (e) {
//     res.status(e.message).send();
//   }
// });

// // PATCH update info
// //jwtCheck, jwtAuthz(['update:info']),
// router.patch('/infos/:id', (req, res) => {
//   let id = req.params.id * 1;
//   const uid = req.user.sub;
//   let body = { title: req.body.breed, content: req.body.content, uid, lastModified: Date.now() };
//   // if (!ObjectID.isValid(id)) return res.status(404).send();
//   Info.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
//     .then((info) => {
//       if (!info) return res.status(404).send();
//       res.send(info);
//     }).catch((e) => res.status(404).send());
// });

module.exports = router;