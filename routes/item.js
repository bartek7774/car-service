const mongoose = require('mongoose');
const router = require('express').Router();
const jwtAuthz = require('express-jwt-authz');
const { jwtCheck } = require('../helpers/security/auth');
const { autoUpload } = require('../helpers/images/upload');
const { ObjectID } = require('mongodb');

const { Item } = require('./../models/item');

router.post('/item', autoUpload(), (req, res) => {
  // const uid = req.user.sub;
  // const uid = 'sub-123';
  console.log(req);
  let body = {
    name: req.body.name,
    gallery: req.files.slice().map(file => file.path)
  };
  let item = new Item({ _id: new mongoose.Types.ObjectId(), ...body });
  item.save().then((item) => {
    res.send(item);
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

// app.post('/', cpUpload, (req, res) => {
//   try {
//     console.log(req.files);

//     // console.log(req.files['avatar'][0]);
//     var newItem = new Item();
//     var tab = req.files.slice().map(file => file.filename);
//     console.log(tab);
//     newItem.gallery = req.files.slice().map(file => file.path);
//     newItem.name = req.body.name;
//     newItem.save();
//     res.redirect('/');
//   }
//   catch (err) {
//     res.status(400).send();
//   }

// });



module.exports = router;