const express = require('express')
const router = express.Router()
const { ExecSQL } = require('./SqlPool')

// 獲取所有用戶數據
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT UserID, UserPW, Role, NameF, NameL, NameCN,
             Photo, JobTitle, PhoneNum, Email, ComNo, Area
      FROM UserData
    `
    // const sql = `
    //   SELECT *
    //   FROM UserData
    // `

    const result = await ExecSQL(sql)
    res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 修改用戶密碼
router.put('/password', async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body

    // 先驗證舊密碼
    const checkSql = `
      SELECT UserID FROM UserData
      WHERE UserID = @userId AND UserPW = @oldPassword
    `
    const checkResult = await ExecSQL(checkSql, { userId, oldPassword })

    if (checkResult.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        error: '舊密碼不正確',
      })
    }

    // 更新密碼
    const updateSql = `
      UPDATE UserData
      SET UserPW = @newPassword
      WHERE UserID = @userId
    `
    await ExecSQL(updateSql, { userId, newPassword })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 獲取所有負責地區選項
router.get('/areas', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT Area
      FROM UserData
      WHERE Area IS NOT NULL
      ORDER BY Area
    `
    const result = await ExecSQL(sql)
    res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 獲取所有職稱選項
router.get('/jobtitles', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT JobTitle
      FROM UserData
      WHERE JobTitle IS NOT NULL
      ORDER BY JobTitle
    `
    const result = await ExecSQL(sql)
    res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

router.get('/comnos', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT ComNo
      FROM UserData
      WHERE ComNo IS NOT NULL
      ORDER BY ComNo
    `
    const result = await ExecSQL(sql)
    res.json({
      success: true,
      data: result.recordset,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

module.exports = router
