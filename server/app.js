require('dotenv').config()
var express = require('express');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.static('../client/build'));

app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

var db = require('./database')
db.authenticate()
    .then(function() {
      console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
      console.log('Unable to connect to the database:', err);
    });

db.sync()

module.exports = app;
