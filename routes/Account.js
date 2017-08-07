let express = require('express')
let bcrypt  = require('bcrypt-nodejs')

let accountService = require('../ChartGenerator/Services/AccountService')

let router = express.Router()

router.post('/', (req, res, next) => {
  accountService.login(req.body).then(token => {
    res.status(200).json({token: token})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.post('/register', (req, res, next) => {
  accountService.register(req.body).then(token => {
    res.status(200).json({token: token})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.put('/', (req, res, next) => {
  accountService.update(req.get('Authorization'), req.body).then(token => {
    res.status(200).json({token: token})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.post('/confirm', (req, res, next) => {
  accountService.checkAccount(req.body.account).then(() => {
    res.status(200).json({message: 'success'})
  }).catch(error => {
    res.status(400).json(error)
  })
})

router.get('/', (req, res, next) => {
  accountService.getAccount(req.get('Authorization')).then(userInfo => {
    res.status(200).json(userInfo)
  }).catch(error => {
    res.status(400).json(error)
  })
})

module.exports = router