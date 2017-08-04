let express = require('express')
let bcrypt  = require('bcrypt-nodejs')

let accountService = require('../ChartGenerator/Services/AccountService')

let router = express.Router()

router.post('/', (req, res, next) => {
  accountService.login(req.body).then(token => {
    res.json({token: token})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.post('/register', (req, res, next) => {
  accountService.register(req.body).then(token => {
    res.json({token: token})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.put('/', (req, res, next) => {
  accountService.update(req.get('Authorization'), req.body).then(token => {
    res.json({token: token})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.post('/confirm', (req, res, next) => {
  accountService.checkAccount(req.body.account).then(() => {
    res.json({message: 'success'})
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

router.get('/', (req, res, next) => {
  accountService.getAccount(req.get('Authorization')).then(userInfo => {
    res.json(userInfo)
  }).catch(() => {
    res.json({error: 'serverError'})
  })
})

module.exports = router