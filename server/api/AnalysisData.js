const express = require('express')
const router = express.Router()

const { ExecSQL } = require('./SqlPool')

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

// 獲取所有公司列表
router.get('/companies', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT ComNo
      FROM InvData
      ORDER BY ComNo
    `
    const result = await ExecSQL(sql)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 獲取年度營收
router.get('/annual-revenue', async (req, res) => {
  try {
    const { year, company } = req.query
    let sql = `
      SELECT SUM(ProfitMoney * 1) as totalRevenue
      FROM InvData
      WHERE SUBSTRING(YM, 1, 4) = @year
    `
    if (company && company !== 'ALL') {
      sql += ' AND ComNo = @company'
    }

    const result = await ExecSQL(sql, { year, company })
    res.json({
      success: true,
      totalRevenue: result.recordset[0].totalRevenue || 0,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 獲取各公司營收數據
router.get('/company-revenue', async (req, res) => {
  try {
    const { year } = req.query
    const sql = `
      WITH AllCompanies AS (
        SELECT DISTINCT ComNo
        FROM InvData
      ),
      RevenueData AS (
        SELECT
          ComNo,
          ISNULL(SUM(ProfitMoney * 1), 0) as totalRevenue
        FROM InvData
        WHERE SUBSTRING(YM, 1, 4) = @year
        GROUP BY ComNo
      )
      SELECT
        a.ComNo,
        ISNULL(r.totalRevenue, 0) as totalRevenue
      FROM AllCompanies a
      LEFT JOIN RevenueData r ON a.ComNo = r.ComNo
      ORDER BY a.ComNo
    `
    const result = await ExecSQL(sql, { year })
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

// 獲取所有客戶列表
router.get('/customers', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT s01_03b as CustomerName
      FROM InvData
      ORDER BY s01_03b
    `
    const result = await ExecSQL(sql)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 根據公司獲取客戶列表
router.get('/customers-by-company', async (req, res) => {
  try {
    const { comNo } = req.query
    let sql = `
      SELECT DISTINCT s01_03b as CustomerName
      FROM InvData
      WHERE 1=1
    `
    if (comNo) {
      sql += ` AND ComNo = @comNo`
    }
    sql += ` ORDER BY s01_03b`

    const result = await ExecSQL(sql, { comNo })
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

module.exports = router
