const router = require('express').Router();
const jwtAuthz = require('express-jwt-authz');
const { jwtCheck } = require('../helpers/security/auth');
const { ObjectID } = require('mongodb');

const { State } = require('./../models/state');

//jwtCheck, jwtAuthz(['update:state'])
// PATCH update state
router.patch('/states/:id', (req, res) => {
  console.log('patch', req.body);
  console.log(req.params.id);
  let id = req.params.id;
  // const uid = req.user.sub;
  const uid ='abc';
  let body = { name: req.body.name, uid, checked: Date.now() };
  // if (!ObjectID.isValid(id)) return res.status(404).send();
  State.findOneAndUpdate({ _id: id }, { $set: body }, { new: true })
    .then((state) => {
      if (!state) return res.status(404).send();
      res.send(state);
    }).catch((e) => res.status(404).send());
});

module.exports = router;