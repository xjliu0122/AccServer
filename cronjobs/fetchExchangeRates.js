const logger = require('morgan')
const mongoose = require('mongoose')
const config = require('../config/config')
const axios = require('axios')
const db = mongoose.connect(config.DBADDRESS)
const ExchangeRate = require('../models/admin/exchangeRate')

let ratesData = {}
axios({
        method: 'get',
        url: 'https://openexchangerates.org/api/latest.json?app_id=' + config.openexchangerates + '&base=USD'
    }).then(function (response) {
    ratesData = response.data.rates
    let now = new Date()
    let dd = now.getDate()
    let mm = now.getMonth() + 1
    let yyyy = now.getFullYear()
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    let nowDate = yyyy + mm + dd

    // put rates to database
    Object
        .keys(ratesData)
        .forEach(function (key) {
            let rateObj = ExchangeRate({date: nowDate, currency: key, rate: ratesData[key]})
            ExchangeRate
                .findOne({date: nowDate, currency: key})
                .then((rate) => {
                    if (!rate) {
                        //save
                        rateObj.save()
                    }
                })

        }, this)

})
