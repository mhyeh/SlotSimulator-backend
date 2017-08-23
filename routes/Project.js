let express = require('express')

let projectService = require('../ChartGenerator/Services/ProjectService')

let router = express.Router()

router.get('/', (req, res, next) => {
  projectService.getAllProject(req.get('Authorization')).then(allProject => {
    res.status(200).json(allProject)
  }).catch(error => {
    res.status(400).json(error)
  })
})



router.get('/:id', (req, res, next) => {
  projectService.getProjectById(req.get('Authorization'), req.params.id).then(project => {
    res.status(200).json(project)
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.post('/', (req, res, next) => {
  projectService.create(req.get('Authorization'), req.body).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.put('/:id', (req, res, next) => {
  projectService.update(req.get('Authorization'), req.params.id, req.body).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.delete('/:id', (req, res, next) => {
  projectService.deleteProject(req.get('Authorization'), req.params.id).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router