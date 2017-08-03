let express = require('express')
let Promise = require('bluebird')

let projectRepoisitory = require('../ChartGenerator/Repositories/ProjectRepository')
let fileService        = require('../ChartGenerator/Services/FileService')

let router = express.Router()

router.get('/:userId', (req, res, next) => {
  projectRepoisitory.getAllProject(req.params.userId).then(result => {
    res.json(result)
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

router.get('/:userId/:id', (req, res, next) => {
  let data = {}
  projectRepoisitory.getProjectById(req.params.userId, req.params.id).then(result => {
    data = result

    let readFile = {
      baseStops:     fileService.ReadFile(data.baseStops),
      bonusStops:    fileService.ReadFile(data.bonusStops),
      basePayTable:  fileService.ReadFile(data.basePayTable),
      bonusPayTable: fileService.ReadFile(data.bonusPayTable),
      attr:          fileService.ReadFile(data.attr)
    }
    
    return Promise.props(readFile)
  }).then(result => {
    data.baseStops     = result.baseStops
    data.bonusStops    = result.bonusStops
    data.basePayTable  = result.basePayTable
    data.bonusPayTable = result.bonusPayTable
    data.attr          = result.attr
    
    resolve(data)
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

router.post('/:userId', (req, res, next) => {
  let userId    = req.params.userId
  let body      = req.body
  let path      = userId + '/' + req.body.name
  let extension = '.csv'

  if (body.name         === undefined || body.block         === undefined || body.thread     === undefined || 
      body.runTime      === undefined || body.symbol        === undefined || body.reels      === undefined || 
      body.rows         === undefined || body.baseStops     === undefined || body.bonusStops === undefined || 
      body.basePayTable === undefined || body.bonusPayTable === undefined || body.betCost    === undefined || 
      body.path         === undefined) {
    res.json({error: 'serverError'})
  }

  let data = {
    userId:        userId,
    name:          body.name,
    block:         body.block,
    thread:        body.thread,
    runTime:       body.runTime,
    symbol:        body.symbol,
    reels:         body.reels,
    rows:          body.rows,
    betCost:       betCost,
    baseStops:     path + '/baseStops'     + extension,
    bonusStops:    path + '/bonusStops'    + extension,
    basePayTable:  path + '/basePayTable'  + extension,
    bonusPayTable: path + '/bonusPayTable' + extension,
    attr:          path + '/attr'          + extension
  }

  let promise = []
  promise.push(projectRepoisitory.createProject(userId, data))
  promise.push(fileService.CreateFile(data.baseStops,     body.baseStops))
  promise.push(fileService.CreateFile(data.bonusStops,    body.bonusStops))
  promise.push(fileService.CreateFile(data.basePayTable,  body.basePayTable))
  promise.push(fileService.CreateFile(data.bonusPayTable, body.bonusPayTable))
  promise.push(fileService.CreateFile(data.attr,          body.attr))

  Promise.all(promise).then(() => {
    res.json({message: 'success'})
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

router.put('/:userId/:id', (req, res, next) => {
  
})

router.delete('/:userId/:id', (req, res, next) => {
  projectRepoisitory.deleteProject(req.params.userId, req.params.id).then(() => {
    res.json({message: 'success'})
  }).catch(err => {
    res.json({error: 'serverError'})
  })
})

module.exports = router