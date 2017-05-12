var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;

// create a schema
var userBankAccountSchema = new Schema({
  uid:{ type: String, required: true, index: true}, // the user id
  accountNo:{ type: String, required: true},
  accountName:{ type: String, required: true, default: "Account"},
  accessToken:{ type: String, required: true},
  active:{type: Boolean, required: true, default:true},
  deleted:{type: Boolean, required: true, default:false},
  plaidAccountId:{type: String, required: true,index: true},
  plaidItemId: { type: String, required: true}, // this means several account belongs to one plaid item count. 
  plaidUserId: { type: String, required: true},  // this is probably our own user. 
  currentBalance: {type: Number, required: true, default:"0"},
  availableBalance:  {type: Number, required: true, default:"0"},
  institution: { type: String},
  subtype: { type: String},
  type:{ type: String},
  lastPulled:{type: Date, required: true, default: Date.now},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var userBankAccount = mongoose.model('UserBankAccount', userBankAccountSchema);
module.exports = userBankAccount;