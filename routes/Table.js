let express = require('express')

let tableService = require('../ChartGenerator/Services/TableService')

let router = express.Router()

router.get('/:id/overAllSimulation', (req, res, next) => {
  tableService.getOverAllSimulation(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({simulation: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/overAllTheory', (req, res, next) => {
  tableService.getOverAllTheory(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({theory: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/baseGameSimulation', (req, res, next) => {
  tableService.getBaseGameSimulation(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({simulation: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/baseGameTheory', (req, res, next) => {
  tableService.getBaseGameTheory(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({theory: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/FreeGameSimulation', (req, res, next) => {
  tableService.getFreeGameSimulation(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({simulation: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/FreeGameTheory', (req, res, next) => {
  tableService.getFreeGameTheory(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json({theory: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router