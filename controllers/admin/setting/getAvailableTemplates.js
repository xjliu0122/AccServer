var defaultTemplate = require('./default.js')
var Template = require('../../../models/admin/template');
var f = function getAvailableTemplates(req, res, next) {
    var orgId = req.headers['OrgId'];
    if (!orgId || orgId === '') 
        return res.status(500).send()
    var resp = {
        result: [
            {
                name: 'Default',
                data: defaultTemplate
            }
        ]
    }
    Template
        .find({orgid: orgId})
        .then((doc) => {

            doc
                .forEach(function (item) {
                    resp
                        .result
                        .push({name: item.name, data: item.data})
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
