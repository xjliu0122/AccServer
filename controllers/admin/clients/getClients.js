var User = require('../../../models/user');

var f = function getClients(req, res, next) {
    var orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') 
        return res.status(500).send('No Organisation Assigned. Please contact us.')

    var resp = []
    //check if user exists.
    User.find({
        organization: orgId
    }, function (err, users) {
        if (err) {
            throw err
        }
        users
            .forEach(function (user) {
                resp.push(user._doc)
            }, this);
        res.status(200).send(JSON.stringify(resp))
    });

};

module.exports = f;