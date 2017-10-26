let express = require('express')

let projectService = require('../ChartGenerator/Services/ProjectService')

let router = express.Router()

//get all projects
router.get('/', (req, res, next) => {
  projectService.getAllProject(req.get('Authorization')).then(allProject => {
    res.status(200).json(allProject)
  }).catch(error => {
    res.status(400).json(error)
  })
})

//get specify project
router.get('/:id', (req, res, next) => {
  projectService.getProjectById(req.get('Authorization'), req.params.id).then(project => {
    res.status(200).json(project)
  }).catch(error => {
    res.status(400).json(error)
  })
})

// create a new project
router.post('/', (req, res, next) => {
  projectService.create(req.get('Authorization'), req).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

// update project
router.put('/:id', (req, res, next) => {
  projectService.update(req.get('Authorization'), req.params.id, req).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

// delete project
router.delete('/:id', (req, res, next) => {
  projectService.deleteProject(req.get('Authorization'), req.params.id).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/:id/getConfig', (req, res, next) => {
  projectService.getConfig(req.get('Authorization'), req.params.id).then(config => {
    res.status(200).json(config)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router