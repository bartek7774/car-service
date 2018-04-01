require('./config/config');
// Modules
// const { mongoose } = require('./db/mongoose');
require('./playground/mogoose/mongoose')("mongodb://localhost:27017/CarService");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Load routes
// const firebase = require('./routes/firebase');
// const stories = require('./routes/story');
// const states = require('./routes/state');
// const archives = require('./routes/archive');
// const items = require('./routes/item');
const owner = require('./routes/owner');

// App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// to serve uploaded files
app.use(express.static(path.join(__dirname, 'photos')));

// Set port
const port = process.env.PORT || '8080';
app.set('port', port);

// Use Routes

// firebase
// app.use('/auth/firebase', firebase);
// // exposed API
// app.use('/api', states);
// app.use('/api', stories);
// app.use('/api', archives);

// app.use('/api', items);

app.use('/api', owner);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));