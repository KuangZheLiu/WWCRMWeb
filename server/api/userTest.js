//user.js
const express = require('express')
const db = require('mssql')
const router = express.Router()

/* GET home page. */
router.get('/info', function (req, res, next) {
  console.log('hello world')
  res.send('hello world')
})
module.exports = router
