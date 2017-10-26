let express      = require('express')
let path         = require('path')
let logger       = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser   = require('body-parser')
let favicon      = require('serve-favicon')
let cors         = require('cors')

let Account      = require('./routes/Account')
let Project      = require('./routes/Project')
let ProjectType  = require('./routes/ProjectType')
let AnalysisData = require('./routes/AnalysisData')
let FileUpload   = require('./routes/FileUpload')

let RedisRepository = require('./ChartGenerator/Repositories/RedisRepository')

let errorMsgService = require('./ChartGenerator/Services/ErrorMsgService')

let app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())

app.use('/account', Account)

// verify token
app.use((req, res, next) => {
  let token = req.get('Authorization')
  RedisRepository.getAccountInfo(token).then(accountInfo => {
    next()
  }).catch(error => {
    res.status(400).json(errorMsgService.tokenExpired)
  })
})

app.use('/project',      Project)
app.use('/projectType',  ProjectType)
app.use('/analysisData', AnalysisData)
app.use('/fileUpload',   FileUpload)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
