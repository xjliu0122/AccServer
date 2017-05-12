var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

// create a schema
var documentSchema = new Schema({
  docId: { type: String, required: true, index: true},
  uid:{ type: String, required: true}, // document belong to whom?
  type: { type: String, required: true}, 
  transactionTotalAmount: { type: Number}, 
  transactionTaxAmount: { type: Number}, 
  transactionTotalUSD : { type: Number}, 
  transactionTaxUSD : { type: Number}, 
  transactioncurr: { type: String}, 
  transactiondate : { type: String}, 
  transactionSupplier : { type: String}, 
  transactionIdentifier : { type: String}, 
  transactionCategory : { type: String}, 
  linkedBankTransaction : { type: String}, 
  linkedBank: { type: String}, 
  transactionCategoryDesc: { type: String}, 
  thumbnail: {type: String}, // for photo docs we need to show them. 
  processed:{type: Boolean, required: true, default:false},
  matched:{type: Boolean, required: true, default:false},
  processedImageDocId:{type: String},
  comment:{type: String}, 
  location:{type: String}, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

documentSchema.index({ uid: 1, type:1, created_at: -1 }); // select by user Id and limit by descending date. 
documentSchema.index({ uid: 1, type:1, processed: 1, created_at: -1 ,}); 

// the schema is useless so far
// we need to create a model using it
var document = mongoose.model('Document', documentSchema);

module.exports = document;