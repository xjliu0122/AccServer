var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
// create a schema
var exchangeRateSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});
exchangeRateSchema.index({date: -1, currency: 1});

var exchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);

module.exports = exchangeRate;