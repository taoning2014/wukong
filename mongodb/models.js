var express = require('express');
var app = express();

var mongoose = require('mongoose');

var uristring = process.env.WUKONG_MONGO_URL;
var User;
var models;

mongoose.connect(uristring);
User = mongoose.model('User', require('./userSchema'), 'users');
models = {
  User: User
};

module.exports = models;
