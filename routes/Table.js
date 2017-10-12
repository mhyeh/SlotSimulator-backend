let express = require('express')

let tableService = require('../ChartGenerator/Services/TableService')

let router = express.Router()

router.get('/:id/:type', (req, res, next) => {
  tableService.getTable(req.get('Authorization'), req.params.id, req.params.type).then(result => {
    res.status(200).json({table: result})
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router