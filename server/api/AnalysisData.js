const express = require('express')
const router = express.Router()

const { ExecSQL } = require('./SqlPool')

// 先 SELECT DISTINCT 找出相異
// SELECT DISTINCT s01_03b FROM InvData where ComNo = 'TWTTH' and YM = '202402'

//     SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202410' and  s01_03b = 'TUMI USA'

// SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202410' and  s01_03b = 'AWAY'

// SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202403' and  s01_03b = '半成品轉單客戶'

// 1. 按公司和客戶統計每月訂單數
router.get('/customer-analysis', async (req, res) => {
  try {
    const { comNo, startDate, endDate } = req.query

    const sql = `
      SELECT
        YM,
        s01_03b as CustomerName,
        COUNT(*) as OrderCount
      FROM InvData
      WHERE ComNo = @comNo
        AND YM BETWEEN @startDate AND @endDate
      GROUP BY YM, s01_03b
      ORDER BY YM ASC
    `

    const result = await ExecSQL(sql, {
      comNo,
      startDate,
      endDate,
    })

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
// 2. 按公司和產品類別統計每月訂單數
router.get('/product-analysis', async (req, res) => {
  try {
    const { comNo, startDate, endDate } = req.query

    const sql = `
      SELECT
        YM,
        b11_03 as ProductType,
        COUNT(*) as OrderCount
      FROM InvData
      WHERE ComNo = @comNo
        AND YM BETWEEN @startDate AND @endDate
      GROUP BY YM, b11_03
      ORDER BY YM ASC
    `

    const result = await ExecSQL(sql, {
      comNo,
      startDate,
      endDate,
    })

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
// 3. 按公司統計每月訂單總數
router.get('/company-analysis', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const sql = `
      SELECT
        YM,
        ComNo,
        COUNT(*) as OrderCount
      FROM InvData
      WHERE YM BETWEEN @startDate AND @endDate
      GROUP BY YM, ComNo
      ORDER BY YM ASC
    `

    const result = await ExecSQL(sql, {
      startDate,
      endDate,
    })

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
// 4. 按產品類別統計各公司每月訂單數
router.get('/product-company-analysis', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const sql = `
      SELECT
        YM,
        ComNo,
        b11_03 as ProductType,
        COUNT(*) as OrderCount
      FROM InvData
      WHERE YM BETWEEN @startDate AND @endDate
      GROUP BY YM, ComNo, b11_03
      ORDER BY YM ASC
    `

    const result = await ExecSQL(sql, {
      startDate,
      endDate,
    })

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
