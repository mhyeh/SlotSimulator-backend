let express = require('express')

let dataService = require('../ChartGenerator/Services/DataService')

let router = express.Router()

router.get('/chart/:id/distribution', (req, res, next) => {
  dataService.getDistribution(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (每 400 筆紀錄一次 RTP)
router.get('/chart/:id/rtp', (req, res, next) => {
  dataService.getRTP(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (觸發 free game 壓力)
router.get('/chart/:id/totalNetWin', (req, res, next) => {
  dataService.getTotalNetWin(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// get player experience (存活率分析)
router.get('/chart/:id/survivalRate', (req, res, next) => {
  dataService.getSurvivalRate(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/table/:id/:type', (req, res, next) => {
  dataService.getTable(req.get('Authorization'), req.params.id, req.params.type).then(result => {
    res.status(200).json({table: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router
