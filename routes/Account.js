let Promise = require('bluebird')
let express = require('express')
let bcrypt = require('bcrypt-nodejs')

let AccountRepository = require('../ChartGenerator/Repositories/AccountRepository')
let RedisRepository = require('../ChartGenerator/Repositories/RedisRepository')

let router = express.Router()

let getUnusedToken = function () {
  let token = bcrypt.genSaltSync(40).toString('base64').substr(7, 20)
  return new Promise((resolve, reject) => {
    RedisRepository.getAccount(token).then(result => {
      getUnusedToken().then(resolve)
    }).catch(() => {
      resolve(token)
    })
  })
}

let createToken = function (account) {
  return new Promise((resolve, reject) => {
    getUnusedToken().then(result => {
      RedisRepository.checkAccount(result, account)
      resolve(result)
    })
  })
}

router.post('/', (req, res, next) => {
  let user = req.body

  if (user.account === undefined || user.password === undefined) {
    res.json({error: 'serverError'})
  }
    
  AccountRepository.getPassword(user.account).then(result => {
    if (!bcrypt.compareSync(user.password, result)) {
      res.json({error: 'serverError'})
    } else {
      createToken(user.account).then(result => {
        res.json({'token': result})
      })
    }
  }).catch(error => {
    res.json({error: 'serverError'})
  })
})

router.post('/register', (req, res, next) => {
  let user = req.body

  if (user.password === undefined || user.checkPassword === undefined || user.account === undefined || 
      user.password != user.checkPassword || user.name === undefined) {
    res.json({error: 'serverError'})
  }

  let hsahPassword = bcrypt.hashSync(user.password);

  AccountRepository.getPassword(user.account).then(() => {
    res.json({error: 'serverError'})
  }).catch(() => {
    AccountRepository.createAccount(user.account, hsahPassword, user.name).then(() => {
      return createToken(user.email)
    }).then(result => {
      res.json({'token': result})
    }).catch(error => {
      res.json({error: 'serverError'})
    })
  })
})

router.put('/', (req, res, next) => {
  let updateData = req.body
  let userData
  RedisRepository.getAccount(req.get('Authorization')).then(result => {
    return AccountRepository.getUserInfo(result)
  }).then((result) => {
    userData = result

    if (updateData.password === undefined || !bcrypt.compareSync(updateData.password, userData.password)) {
      res.json({error: 'serverError'})
    }

    updateData.newName     = ((updateData.newName != undefined) ? updateData.newName : userData.newName)
    updateData.newPassword = ((updateData.newPassword != undefined && updateData.checkNewPassword != undefined &&
                            updateData.newPassword === updateData.checkNewPassword) ? 
                            bcrypt.hashSync(updateData.newPassword) : userData.password)
    
    return AccountRepository.updateAccount(userData.id, updateData.newPassword, updateData.newName)
  }).then(result => {
    RedisRepository.set(req.get('Authorization'), userData.email)
    res.json({message: 'success'})
  }).catch(error => {
    res.json({error: 'serverError'})
  })
})

router.post('/confirm', (req, res, next) => {
  let account = req.body.account

  if (account === undefined) {
    res.json({error: 'serverError'})
  }
  
  AccountRepository.getPassword(account).then(() => {
    res.json({error: 'serverError'})
  }).catch(() => {
    res.json({message: 'success'})
  })
})

router.get('/', (req, res, next) => {
  let token = req.get("Authorization")
  let user = {}

  return new Promise((resolve, reject) => {
    RedisRepository.getAccount(token).then(result => {
      return AccountRepository.getUserInfo(result)
    }).then(result => {
      res.json(result)
    }).catch(error => {
      res.json({error: 'serverError'})
    })
  })
})

module.exports = router