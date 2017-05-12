var User = require('../../../models/user');

var f = function getClients(req, res, next) {
    let orgId = req.headers['OrgId']
    let uid = req.params.uid
    if (!orgId || orgId === '') 
        return res.status(500).send('No Organisation Assigned. Please contact us.')

    let coaList = []
    //check if user exists.
    User
        .findOne({uid: uid})
        .then(user => {
            if (user) {
                coaList = user.chartOfAccounts
            } else {
                throw new Error("User not found")
            }
            res.status(200).send(JSON.stringify(coaList))
           
        })
        .catch(err => {
            if (err) 
                res.status(500).send()
        })

};

module.exports = f;