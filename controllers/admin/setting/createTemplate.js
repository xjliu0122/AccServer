var Template = require('../../../models/admin/template');
var f = function createTemplate(req, res, next) {
    var orgId = req.headers['OrgId'];
    if (!orgId || orgId === '')
        return res.status(500).send()
    Template
        .find({
            orgid: orgId,
            name: req.body.name
        })
        .then((doc) => {

            if (doc.length > 0)
                return res.status(500).send("Tempalte exists already. Please use a different name.")
            else {

                var toCreate = Template({
                    orgid: orgId,
                    name: req.body.name,
                    data: req.body.data
                })
                return toCreate.save()
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