//1.import module
const express = require('express')
// const bodyParser = require('body-parser')

//2.create server
let server = express()
// server.use(express.urlencoded())
// 中間件要寫在啟動文件裡面
// 新版本的 Express 中，可以直接使用 Express 內建的中間件
// extended: true 允許解析複雜對象 ; extended: false 只解析簡單數據
// server.use(bodyParser.json())
// server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

const cors = require('cors')
server.use(cors())

// CORS 配置
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

const user = require('./api/userTest.js')
const testdbRouter = require('./api/testdb.js')
const crmdbRouter = require('./api/crmdb.js')
const dbRouter = require('./api/db.js')
const analysisDataRouter = require('./api/AnalysisData.js')
const orderDataRouter = require('./api/OrderData.js')
const salesLogRouter = require('./api/SalesLog.js')
const userDataRouter = require('./api/UserData.js')
// server.use('/', user)
server.use('/testdb', testdbRouter)
server.use('/api/crmdb', crmdbRouter) // 使用路由器中間件
server.use('/api/db', dbRouter)
server.use('/api/analysis', analysisDataRouter)
server.use('/api/orderdata', orderDataRouter)
server.use('/api/saleslog', salesLogRouter)
server.use('/api/userdata', userDataRouter)

//3.active server
// server.listen(8002, () => {
//   console.log('Server Actived, port 8802')
// })

// 錯誤處理中間件
server.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  })
})

const port = process.env.PORT || 8002
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
