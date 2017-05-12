
const UserBankAccount = require('../../models/userBankAccount.js');

let f = function (req, res, next) {

    let data = req.body;
    //get user from request body. 
    let uid = req.headers['x-uid'];
    var resp = {
        status: '',
        result: []
    }
    // Get Database
    UserBankAccount.find({
        uid: uid
    }).then((result) => {
        resp.status = "success";
        result.forEach(function (rec) {
            if (!rec.deleted) {
                let item = {
                    accountNo: rec.accountNo,
                    institution: rec.institution,
                    currentBalance: rec.currentBalance,
                    availableBalance: rec.availableBalance,
                    active: rec.active,
                    accountName: rec.accountName
                };
                resp.result.push(item);
            }
        }, this);
        res.status(200).send(JSON.stringify(resp));
    }).catch((err) => {
        resp.status = "error";
        resp.message = err.message;
        res.status(500).send(JSON.stringify(resp));
    })
}
module.exports = f;


// {
//     "status": "success",
//     "result": [{
//             "accountNo": "9743",
//             "institution": "chase",
//             "currentBalance": 40,
//             "availableBalance": 7960,
//             "active": true,
//             "accountName": "CREDIT CARD"
//         },
//         {
//             "accountNo": "9970",
//             "institution": "chase",
//             "currentBalance": 8466.9,
//             "availableBalance": 8466.9,
//             "active": true,
//             "accountName": "TOTAL CHECKING"
//         },
//         {
//             "accountNo": "2416",
//             "institution": "chase",
//             "currentBalance": 128,
//             "availableBalance": 9848.55,
//             "active": true,
//             "accountName": "CREDIT CARD"
//         }
//     ],
// }