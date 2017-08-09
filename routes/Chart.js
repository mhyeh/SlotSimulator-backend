let express = require('express')

let chartService = require('../ChartGenerator/Services/ChartService')

let router = express.Router()

router.get('/:id/overAll', (req, res, next) => {
  chartService.getOverAll(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/baseGame', (req, res, next) => {
  chartService.getBaseGame(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/freeGame', (req, res, next) => {
  chartService.getFreeGame(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/rtp', (req, res, next) => {
  chartService.getRTP(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/totalNetWin', (req, res, next) => {
  chartService.getTotalNetWin(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/survivalRate', (req, res, next) => {
  chartService.getSurvivalRate(req.get('Authorization'), req.params.id, req.query).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router
