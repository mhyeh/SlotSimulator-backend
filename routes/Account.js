let Promise = require('bluebird')
let express = require('express')
let bcrypt  = require('bcrypt-nodejs')

let AccountService = require('../ChartGenerator/Services/AccountService')

let router = express.Router()

router.post('/', (req, res, next) => {
  AccountService.login(req.body).then(result => {
    res.json({token: result})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.post('/register', (req, res, next) => {
  AccountService.register(req.body).then(result => {
    res.json({token: result})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.put('/', (req, res, next) => {
  AccountService.update(req.get('Authorization'), req.body).then(result => {
    res.json({token: result})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.post('/confirm', (req, res, next) => {
  AccountService.checkAccount(req.body.account).then(() => {
    res.json({message: 'success'})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.get('/', (req, res, next) => {
  AccountService.checkAccount(req.get('Authorization')).then(result => {
    res.json(result)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

module.exports = router