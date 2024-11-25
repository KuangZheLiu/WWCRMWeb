const express = require('express')
const router = express.Router()

const { ExecSQL } = require('./SqlPool')

const query = `
      SELECT COUNT(s01_03b) AS twtData_1 FROM InvData
      WHERE ComNo = 'TWTTH' AND YM = '202311'
      ORDER BY YM DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `

// 先 SELECT DISTINCT 找出相異
// SELECT DISTINCT s01_03b FROM InvData where ComNo = 'TWTTH' and YM = '202402'

//     SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202410' and  s01_03b = 'TUMI USA'

// SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202410' and  s01_03b = 'AWAY'

// SELECT COUNT(s01_03b) AS twtData_1 FROM InvData where ComNo = 'TWTTH' and YM = '202403' and  s01_03b = '半成品轉單客戶'

async function getPagedInvData(filters = {}, page = 1, pageSize = 50) {
  try {
    const pool = new msSql.ConnectionPool(sqlConfig)
    await pool.connect()

    const request = pool.request()

    // 構建查詢條件
    let whereClause = '1=1'
    if (filters.companyName) {
      whereClause += ' AND ComNo = @companyName'
      request.input('companyName', msSql.NVarChar, filters.companyName)
    }
    if (filters.time) {
      whereClause += ' AND YM = @time'
      request.input('time', msSql.NVarChar, filters.time)
    }
    if (filters.customerName) {
      whereClause += ' AND s01b_03 = @customerName'
      request.input('customerName', msSql.NVarChar, filters.customerName)
    }

    const offset = (page - 1) * pageSize

    // 查詢數據
    const query = `
      SELECT
        ComNo AS 公司名稱,
        YM AS 時間,
        s01b_03 AS 客戶名稱,
        s02_02 AS 品名,
        ShipCostMoney AS 銷貨成本,
        ProfitRate AS 毛利率,
        InvMoney2 AS 原幣銷貨額
      FROM InvData
      WHERE ${whereClause}
      ORDER BY YM DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `

    request.input('offset', msSql.Int, offset)
    request.input('pageSize', msSql.Int, pageSize)

    const result = await request.query(query)
    return result.recordset
  } catch (err) {
    console.error('Database query error:', err)
    throw err
  } finally {
    await pool.close()
  }
}

router.getPagedInvData = getPagedInvData
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
