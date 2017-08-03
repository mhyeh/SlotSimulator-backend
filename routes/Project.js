let express = require('express')
let dataRepoisitory = require('../ChartGenerator/Repositories/ProjectRepository')
let router = express.Router()

router.get('/', (req, res, next) => {
  dataRepoisitory.getAllProject().then(result => {
    res.json(result)
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

router.get('/:id', (req, res, next) => {
  dataRepoisitory.getProjectById(req.params.id).then(result => {
    
  })
})

router.post('/', (req, res, next) => {

})

router.put('/:id', (req, res, next) => {

})

router.delete('/:id', (req, res, next) => {
  dataRepoisitory.deleteProject(req.params.id).then(() => {
    res.json({message: 'success'})
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

module.exports = router