"use strict";
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var Polly = require('./polly');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.post('/Listen', (req, res) => {
  console.log("AVC", req.body);
  Polly.Speak(req.body)
  return res.send(200);
});

app.post('/Download', (req, res) => {
  console.log("AVC", req.body);
  Polly.Download(req.body)
  return res.send(200);
});



app.listen(3000, () => console.log('Gator app listening on port 3000!'));

