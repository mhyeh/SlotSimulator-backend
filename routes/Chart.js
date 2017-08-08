let express = require('express')

let chartService = require('../ChartGenerator/Services/ChartService')

let router = express.Router()

router.get('/:id/rtp', (req, res, next) => {
  chartService.getRTP(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.json(result)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.get('/:id/totalNetWin', (req, res, next) => {
  chartService.getTotalNetWin(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.json(result)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.get('/:id/survivalRate', (req, res, next) => {
  chartService.getSurvivalRate(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.json(result)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

module.exports = router
