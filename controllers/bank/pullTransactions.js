
const async = require("async");
const BankTransaction = require('../../models/bankTransaction.js');

let pull = function (uid,transactions, func) {
    async.forEach(transactions, function (transaction, callback) {
        let bankTransaction = BankTransaction({
            uid:uid,
            transactionId: transaction._id,
            plaidAccountId: transaction._account,
            amount: transaction.amount,
            transactionDate: transaction.date,
            pending: transaction.pending,
            name: transaction.name,
            category: transaction.category
        });
        BankTransaction.findOne({
                transactionId: transaction._id
            }).then((transaction) => {
                if (transaction) {
                    Promise.resolve();
                } else {
                    // not  pulled before. save it. 
                    return bankTransaction.save()
                }
            }).then((result) => {

                callback();
            })
            .catch((err) => {
                if (err) throw err;
            })
    }, function (err) {
        func(err);
    });
}
module.exports = pull;