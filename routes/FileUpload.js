let express    = require('express')

let uploadService = require('../ChartGenerator/Services/UploadService')

let router = express.Router()

// upload files of the result of simulation
router.put('/:id', (req, res, next) => {
  uploadService.uploadFile(req.get('Authorization'), req.params.id, req).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router
