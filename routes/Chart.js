let express = require('express')

let chartService = require('../ChartGenerator/Services/ChartService')

let router = express.Router()

router.get('/:id/distribution', (req, res, next) => {
  chartService.getDistribution(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (每 400 筆紀錄一次 RTP)
router.get('/:id/rtp', (req, res, next) => {
  chartService.getRTP(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (觸發 free game 壓力)
router.get('/:id/totalNetWin', (req, res, next) => {
  chartService.getTotalNetWin(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (存活率分析)
router.get('/:id/survivalRate', (req, res, next) => {
  chartService.getSurvivalRate(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router
