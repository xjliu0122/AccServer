var Template = require('../../../models/admin/template');
var f = function updateTemplate(req, res, next) {
    var orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') 
        return res.status(500).send()
    Template
        .find({orgid: orgId, name: req.body.name})
        .then((doc) => {

            if (doc.length > 0) {
                doc[0].data = req.body.data
                return doc[0].save()
            } else {
                res
                    .status(500)
                    .send("Tempalte " + req.body.name + " does not exist")
            }
        })
        .then((result) => {
            res
                .status(200)
                .send();
        })
        .catch((err) => {
            res
                .status(500)
                .send();
        })

};

module.exports = f;