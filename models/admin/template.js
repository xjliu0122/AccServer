var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
// create a schema
var templateSchema = new Schema({
  orgid: { type: String, required: true, index: true},
  name: { type: String, required: true},
  data: Array 
});
// the schema is useless so far
// we need to create a model using it
var template = mongoose.model('Template', templateSchema);

module.exports = template;