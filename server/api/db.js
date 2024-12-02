const express = require('express')
const router = express.Router()
const { ExecSQL } = require('./SqlPool')

// 優化查詢效能的通用函數
const buildWhereClause = (filters) => {
  const conditions = ['1=1']
  const params = {}

  if (filters.companyName?.trim()) {
    conditions.push('ComNo = @companyName')
    params.companyName = filters.companyName.trim()
  }
  if (filters.customerName?.trim()) {
    conditions.push('s01_03b = @customerName')
    params.customerName = filters.customerName.trim()
  }
  if (filters.startDate?.trim()) {
    conditions.push('YM >= @startDate')
    params.startDate = filters.startDate.trim()
  }
  if (filters.endDate?.trim()) {
    conditions.push('YM <= @endDate')
    params.endDate = filters.endDate.trim()
  }

  return {
    whereClause: conditions.join(' AND '),
    params,
  }
}

// 優化後的 invdata 路由
router.get('/invdata', async (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query
    const parsedPage = parseInt(page)
    const parsedPageSize = parseInt(pageSize)

    const { whereClause, params } = buildWhereClause(req.query)

    // 使用 WITH 子句優化查詢
    const sql = `
      WITH FilteredData AS (
        SELECT
          ComNo,
          YM,
          s01_03b,
          s02_02,
          ShipCostMoney,
          ProfitRate,
          InvMoney2,
          COUNT(*) OVER() as TotalCount,
          ROW_NUMBER() OVER(ORDER BY YM DESC) as RowNum
        FROM InvData WITH (NOLOCK, INDEX(IX_InvData_Search))
        WHERE ${whereClause}
      )
      SELECT
        ComNo,
        YM,
        s01_03b,
        s02_02,
        ShipCostMoney,
        ProfitRate,
        InvMoney2,
        TotalCount as total
      FROM FilteredData
      WHERE RowNum BETWEEN @offset + 1 AND @offset + @pageSize
    `

    params.offset = (parsedPage - 1) * parsedPageSize
    params.pageSize = parsedPageSize

    const result = await ExecSQL(sql, params)

    // 處理查詢結果
    const total = result.recordset[0]?.total || 0

    res.json({
      success: true,
      data: result.recordset,
      total,
      page: parsedPage,
      pageSize: parsedPageSize,
      cache: true,
      timestamp: Date.now(),
    })
  } catch (err) {
    console.error('查詢錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: Date.now(),
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
