let express = require('express')

let projectService = require('../ChartGenerator/Services/ProjectService')

let router = express.Router()

router.get('/', (req, res, next) => {
  projectService.getAllProject(req.get('Authorization')).then(allProject => {
    res.json(allProject)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.get('/:id', (req, res, next) => {
  projectService.getProjectById(req.get('Authorization'), req.params.id).then(project => {
    res.json(project)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.post('/', (req, res, next) => {
  projectService.create(req.get('Authorization'), req.body).then(() => {
    res.json({message: 'success'})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.put('/:id', (req, res, next) => {
  projectService.update(req.get('Authorization'), req.params.id, req.body).then(() => {
    res.json({message: 'success'})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.delete('/:id', (req, res, next) => {
  projectService.deleteProject(req.get('Authorization'), req.params.id).then(() => {
    res.json({message: 'success'})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

module.exports = router