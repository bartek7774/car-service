const router = require('express').Router();
const firebaseAdmin = require('firebase-admin');
const {jwtCheck} = require('../helpers/security/auth');

// Initialize Firebase Admin with service account
const serviceAccount = require(process.env.FIREBASE_KEY);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB
});
// GET object containing Firebase custom token
router.get('/', jwtCheck, (req, res) => {
  // Create UID from authenticated Auth0 user
  console.log(req.user);
  const uid = req.user.sub;
  // Mint token using Firebase Admin SDK
  firebaseAdmin.auth().createCustomToken(uid)
    .then(customToken =>{
      // Response must be an object or Firebase errors
     return res.json({ firebaseToken: customToken })
    })
    .catch(err =>
      res.status(500).send({
        message: 'Something went wrong acquiring a Firebase token.',
        error: err
      })
    );
});

module.exports = router;