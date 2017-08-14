let express = require('express')

let tableService = require('../ChartGenerator/Services/TableService')

let router = express.Router()

router.get('/:id/overAll', (req, res, next) => {
    tableService.getOverAll(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/baseGame', (req, res, next) => {
    tableService.getBaseGame(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/FreeGame', (req, res, next) => {
    tableService.getFreeGame(req.get('Authorization'), req.params.id).then(result => {
    res.status(200).json(result)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router