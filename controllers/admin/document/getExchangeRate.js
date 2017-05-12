const ExchangeRate = require('../../../models/admin/exchangeRate');

let f = function (req, res, next) {

    let date = req.params.date
    let curr = req.params.curr
    let resp = 1;

    ExchangeRate.findOne({
        date: date,
        currency: curr
    }).then((result) => {
      if(!result){
        return ExchangeRate.findOne({           
            currency: curr
        })
      }else{
        res.status(200).send(JSON.stringify(result.rate))
      }
    }).then(result=>{
        if(result){
            res.status(200).send(JSON.stringify(result.rate))
        }else{
            throw new Error('')
        }
    })
    .catch((err) => {
        resp = {}
        resp.status = 'error'
        resp.message = "Failed to get exchange rate"
        res.status(500).send(JSON.stringify(resp))
    })
};

module.exports = f;