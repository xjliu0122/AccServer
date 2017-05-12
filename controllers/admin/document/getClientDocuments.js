var Document = require('../../../models/document');
var f = function getClientDocuments(req, res, next) {
    var uid = req.params.uid;
    var type = req.params.type;
    if (!uid || uid === '') 
        return res.status(500).send("No UserID presented when loading documents")
    var resp = {result:[]}
    Document
        .find({uid: uid, type: type})
        .then((doc) => {

            doc
                .forEach(function (item) {
                    resp
                        .result
                        .push(item._doc)
                }, this);

            resp.result
            .forEach(function (item) {
                item.thumbnail = null
            }, this);

            res
                .status(200)
                .send(JSON.stringify(resp))

        })
        .catch((err) => {
            res
                .status(500)
                .send()
            //.send(JSON.stringify(defaultTemplate))
        })

};

module.exports = f;
