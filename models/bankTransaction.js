var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

// create a schema
var bankTransactionSchema = new Schema({
  uid:{ type: String, required: true }, // the user id
  transactionId:{ type: String, required: true, index: true}, // the user id
  plaidAccountId:{type: String, required: true },
  amount:{type: Number, required: true, default:"0"},
  transactionDate:{type: Date, required: true, default:Date.now},
  pending:{type: Boolean, required: true, default:false},
  name:{type: String, required: true, default:"N/A"},
  category:{type: Array},
  created_at: { type: Date, default: Date.now}
});
bankTransactionSchema.index({ plaidAccountId: 1, created_at: -1 }); // select by account Id and limit by descending date. 
bankTransactionSchema.index({ uid : 1,transactionDate : -1,plaidAccountId : 1 }); 

// the schema is useless so far
// we need to create a model using it
var bankTransaction = mongoose.model('BankTransaction', bankTransactionSchema);
module.exports = bankTransaction;