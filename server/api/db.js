const express = require('express')
const router = express.Router()

const { ExecSQL } = require('./SqlPool')

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

router.get('/invdata', async (req, res) => {
  try {
    const { page = 1, pageSize = 50, companyName, time, customerName } = req.query

    let whereClause = '1=1'
    const params = {
      offset: (page - 1) * pageSize,
      pageSize: parseInt(pageSize),
    }

    if (companyName) {
      whereClause += ' AND ComNo = @companyName'
      params.companyName = companyName
    }

    if (time) {
      whereClause += ' AND YM = @time'
      params.time = time
    }

    if (customerName) {
      whereClause += ' AND s01_03b = @customerName'
      params.customerName = customerName
    }

    // 查詢總數
    const countSql = `
      SELECT COUNT(*) as total
      FROM InvData
      WHERE ${whereClause}
    `
    const countResult = await ExecSQL(countSql, params)
    const total = countResult.recordset[0].total

    // 查詢數據
    const dataSql = `
      SELECT
        ComNo,
        YM,
        s01_03b,
        s02_02,
        ShipCostMoney,
        ProfitRate,
        InvMoney2
      FROM InvData
      WHERE ${whereClause}
      ORDER BY YM DESC
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `
    const dataResult = await ExecSQL(dataSql, params)

    res.json({
      success: true,
      data: dataResult.recordset,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    })
  } catch (err) {
    console.error('查詢錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

router.get('/comdata', async (req, res) => {
  try {
    const { page = 1, pageSize = 50, companyName, customerName } = req.query

    let whereClause = '1=1'
    const params = {
      offset: (page - 1) * pageSize,
      pageSize: parseInt(pageSize),
    }

    if (companyName) {
      whereClause += ' AND ComNo = @companyName'
      params.companyName = companyName
    }

    if (customerName) {
      whereClause += ' AND ComName LIKE @customerName'
      params.customerName = `%${customerName}%`
    }

    const countSql = `
      SELECT COUNT(*) as total
      FROM ComData
      WHERE ${whereClause}
    `
    const countResult = await ExecSQL(countSql, params)
    const total = countResult.recordset[0].total

    const dataSql = `
      SELECT *
      FROM ComData
      WHERE ${whereClause}
      ORDER BY ComNo
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `
    const dataResult = await ExecSQL(dataSql, params)

    res.json({
      success: true,
      data: dataResult.recordset,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    })
  } catch (err) {
    console.error('查詢錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

module.exports = router
