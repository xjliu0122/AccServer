let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Schema = mongoose.Schema;
// create a schema
let glRecordSchema = new Schema({
  recid: { type: String, required: true},
  uid: { type: String, required: true},
  coaId: { type: String, required: true},
  date: {type: String, required: true},
  docIdRef: { type: String, required: false , index: true},
  amount: { type: String, required: true},
  reversal:{type: String},
  identifier:{type: String, required: true}
})
glRecordSchema.index({uid: 1, coaId: 1,date: -1});

let glRecord = mongoose.model('GLRecord', glRecordSchema);

module.exports = glRecord;