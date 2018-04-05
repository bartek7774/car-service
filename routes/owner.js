const mongoose = require('mongoose');
const router = require('express').Router();
const jwtAuthz = require('express-jwt-authz');
const { jwtCheck } = require('../helpers/security/auth');
const { ObjectID } = require('mongodb');
// const { autoUpload } = require('../helpers/images/upload');

const { Owner } = require('./../models/owner');
const { Car } = require('./../models/car');

router.get('/cars/:id', (req, res) => {
  let id = req.params.id;
  Car.findById(id).then((car) => {
    if (!car) {
      return res.status(404).send();
    }
    res.send(car);
  }).catch(e => res.status(400).send());
});

// GET returns cars
router.get('/cars', (req, res) => {
  Car.find({}).then((cars) => {
    if (!cars) {
      return res.status(404).send();
    }
    res.send(cars);
  }).catch(e => res.status(400).send());
});

// PATCH update info
//jwtCheck, jwtAuthz(['update:info']),
router.patch('/cars/:id', (req, res) => {
  let id = req.params.id;
  let body = {
    model: req.body.model,
    plate: req.body.plate,
    cost: req.body.cost,
    isFullyDamaged: req.body.isFullyDamaged
  };
  // if (!ObjectID.isValid(id)) return res.status(404).send();
  Car.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
    .then((car) => {
      if (!car) return res.status(404).send();
      res.send(car);
    }).catch((e) => res.status(404).send());
});

router.delete('/cars/:id', async (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();
  try {
    let car = await Car.findByIdAndRemove({ _id: id });
    if (!car) return res.status(404).send();

    let _owner = Owner.findById(res.owner);
    let index = _owner.cars.find(x => x === res._id);
    if (index) {
      _owner.cars.splice(index, 1);
      await _owner.save();
    }
    res.send(car);
  }
  catch (err) {
    res.status(404).send();
  }
});

// GET returns owner with given id
router.get('/owner/:id', (req, res) => {
  let id = req.params.id;
  Owner.findById(id).then((owner) => {
    if (!owner) {
      return res.status(404).send();
    }
    res.send(owner);
  }).catch(e => res.status(400).send());
});

// GET returns all the owners
router.get('/owners', (req, res) => {
  Owner.find({}).then((owners) => {
    if (!owners) {
      return res.status(404).send();
    }
    res.send(owners);
  }).catch(e => res.status(400).send());
});

// GET returns cars given owner
router.get('/owner/:id/cars', (req, res) => {
  let id = req.params.id;
  // if (!ObjectID.isValid(id)) return res.status(404).send();
  Owner.findOne({
    _id: id,
  }).populate('cars')
    .then((owner) => {
      if (!owner && owner.cars) {
        return res.status(404).send();
      }
      res.send(owner.cars);
    }).catch(e => res.status(400).send());
});

// POST create new owner
// jwtCheck, jwtAuthz(['create:info'])
router.post('/owner', (req, res) => {
  // const uid = req.user.sub;
  let body = {
    name: req.body.name,
    surname: req.body.surname,
  };
  let owner = new Owner({ _id: new mongoose.Types.ObjectId(), ...body });
  owner.save().then((owner) => {
    res.send(owner);
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});

// POST add car to given owner
router.post('/owner/:id/car', async (req, res) => {
  // const uid = req.user.sub;
  let id = req.params.id;
  let body = {
    model: req.body.model,
    plate: req.body.plate,
    cost: req.body.cost,
    isFullyDamaged: req.body.isFullyDamaged
  };
  try {
    let _owner = await Owner.findById(id);
    if (!_owner) throw new Error('No such owner');
    let car = await new Car({ _id: new mongoose.Types.ObjectId(), ...body, owner: _owner._id }).save();
    _owner.cars.push(car._id);
    await _owner.save();
    res.send(car);
  }
  catch (err) {
    res.status(400).send(err);
  }
  // Owner.findById()
  // Owner.findById(id).then(owner => {
  //   let car = await new Car({ _id: new mongoose.Types.ObjectId(), ...body }).save();
  //   owner.cars.push(car._id);
  //   await owner.save();
  //   res.send(car);
  // })
  //   .catch(err => res.status(400).send(err));
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