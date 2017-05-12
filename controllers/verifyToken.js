var verifyToken = function (admin, req, res, next) {
    try {
        var resp = {};
        var token = req.headers['x-access-token'];
        var idInRequest = req.headers['x-uid'];
        var result = {};
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                var uid = decodedToken.uid;
                if (uid != idInRequest) {
                    resp.status = "error";
                    resp.message = "Please dont hack the system. You can only use token issued to yourself";
                    return res.status(500).json(resp);
                } else {
                    var iat = decodedToken.iat;
                    // if (new Date().valueOf() - iat )<;
                    // resp.status = "success";
                    // resp.message = "token:" + uid;
                    next();
                }
            }).catch(function (err) {
                if (err) {
                    throw err
                }
            });
    } catch (err) {
        resp.status = "error";
        resp.message = "bad token";
        return res.status(500).json(resp);
    }

};

module.exports = verifyToken;