let express = require('express')

let projectService = require('../ChartGenerator/Services/ProjectService')

let router = express.Router()

// get all types of project
router.get('/', (req, res, next) => {
  projectService.getAllProjectType(req.get('Authorization')).then(type => {
    res.status(200).json(type)
  }).catch(error => {
    res.status(400).json(error)
  })
})

//get spectify type of project
router.get('/:id', (req, res, next) => {
  projectService.getProjectTypeById(req.get('Authorization'), req.params.id).then(type => {
    res.status(200).json(type)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router