let express = require('express')

let dataRepoisitory = require('../ChartGenerator/Repositories/DataRepository')

let router = express.Router()

router.get('/rtp', (req, res, next) => {
  let request = req.query

  dataRepoisitory.getRTP(request).then(result => {
    res.json(result)
  })
})

router.get('/totalNetWin', (req, res, next) => {
  let request = req.query

  dataRepoisitory.getTotalNetWin(request).then(result => {
    res.json(result)
  })
})

router.get('/survivalRate', (req, res, next) => {
  let request = req.query
  
  dataRepoisitory.getSurvivalRate(request).then(result => {
    res.json(result)
  })
})


module.exports = router
