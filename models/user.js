var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var config = require('../config/config.js');

// create a schema
var userSchema = new Schema({
  uid: { type: String, required: true, index: true},
  email: { type: String, required: true},
  displayName: String,  
  emailVerified: { type: Boolean, required: true, default: false},
  photoURL: { type: String , default: "http://downloadicons.net/sites/default/files/nice-pie-chart-icon-32287.png"},  
  admin: { type: Boolean, default: true },
  organization: String,
  serviceUrl: String,
  chartOfAccounts: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

module.exports = User;