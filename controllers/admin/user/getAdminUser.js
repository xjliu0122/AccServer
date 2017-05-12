var AdminUser = require('../../../models/admin/adminUser');


var f = function getAdminUser(req, res, next) {
    //get user from request body. 
    var uid = req.headers['x-uid'];    
    var resp = {};
    //check if user exists. 
    AdminUser.findOne({
        uid: uid
    }, function (err, user) {
        if (err) {
            resp.status = 'error';
            resp.message = err.message;
            res.status(500).send(JSON.stringify(resp)).end();
        }
        if (user) {
            resp.status = 'success';            
            resp.result= user.toJSON();               
            resp.result._id = "";
            res.status(200).send(resp);
        } else {            
            resp.status = 'error';
            resp.message = 'User not found';
            res.status(500).send(JSON.stringify(resp)).end();

        }
    });

};

module.exports = f;