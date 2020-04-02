const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config/db');
const app = express();

const port = process.env.PORT || 4000;

// configure database and mongoose
mongoose.set('useCreateIndex', true);
mongoose
  .connect(config.database, { useNewUrlParser: true })
  .then(() => {
    console.log('Database is connected');
  })
  .catch(err => {
    console.log({ database_error: err });
  });

// registering cors
app.use(cors());

// configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configire morgan
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

// define first route
app.get('/', (req, res) => {
  res.json('Hola MEVN devs...Assemble');
});

// bring in user routes
const musicRoutes = require('./api/routes/music');
app.use('/music', musicRoutes)

app.listen(port, () => {
  console.log(`App is running on ${PORT}`);
});
