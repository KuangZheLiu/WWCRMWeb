const express = require('express')
const router = express.Router()
const { ExecSQL } = require('./SqlPool')

// 優化查詢效能的通用函數
const buildWhereClause = (filters) => {
  const conditions = ['1=1']
  const params = {}

  if (filters.year && filters.month) {
    conditions.push('YM = @ym')
    params.ym = `${filters.year}${filters.month}`
  }
  if (filters.salesName?.trim()) {
    conditions.push('Sales = @salesName')
    params.salesName = filters.salesName.trim()
  }
  if (filters.comNo?.trim()) {
    conditions.push('ComNo = @comNo')
    params.comNo = filters.comNo.trim()
  }
  if (filters.orderCom?.trim()) {
    conditions.push('OrderCom LIKE @orderCom')
    params.orderCom = `%${filters.orderCom.trim()}%`
  }
  if (filters.orderPro?.trim()) {
    conditions.push('OrderPro LIKE @orderPro')
    params.orderPro = `%${filters.orderPro.trim()}%`
  }
  if (filters.orderSta?.trim()) {
    conditions.push('OrderSta = @orderSta')
    params.orderSta = filters.orderSta.trim()
  }
  if (filters.orderCurr?.trim()) {
    conditions.push('OrderCurr = @orderCurr')
    params.orderCurr = filters.orderCurr.trim()
  }

  return {
    whereClause: conditions.join(' AND '),
    params,
  }
}

// 查詢訂單資料
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query
    const parsedPage = parseInt(page)
    const parsedPageSize = parseInt(pageSize)

    const { whereClause, params } = buildWhereClause(req.query)

    const sql = `
  WITH FilteredData AS (
    SELECT
      YM,
      Sales,
      ComNo,
      OrderCom,
      OrderNum,
      OrderPro,
      OrderSta,
      OrderCurr,
      OrderAR,
      OrderAL,
      COUNT(*) OVER() as TotalCount,
      ROW_NUMBER() OVER(ORDER BY ${req.query.sortField || 'YM'} ${req.query.sortOrder === 'desc' ? 'DESC' : 'ASC'}) as RowNum
    FROM OrderData WITH (NOLOCK)
    WHERE ${whereClause}
  )
  SELECT *
  FROM FilteredData
  WHERE RowNum BETWEEN @offset + 1 AND @offset + @pageSize
`

    params.offset = (parsedPage - 1) * parsedPageSize
    params.pageSize = parsedPageSize

    const result = await ExecSQL(sql, params)
    const total = result.recordset[0]?.TotalCount || 0

    res.json({
      success: true,
      data: result.recordset,
      total,
      page: parsedPage,
      pageSize: parsedPageSize,
    })
  } catch (err) {
    console.error('查詢錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 新增訂單資料
router.post('/', async (req, res) => {
  try {
    const sql = `
      INSERT INTO OrderData (
        YM, Sales, ComNo, OrderCom, OrderNum,
        OrderPro, OrderSta, OrderCurr, OrderAR, OrderAL
      ) VALUES (
        @YM, @Sales, @ComNo, @OrderCom, @OrderNum,
        @OrderPro, @OrderSta, @OrderCurr, @OrderAR, @OrderAL
      )
    `
    await ExecSQL(sql, req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 更新訂單資料
router.put('/:ym', async (req, res) => {
  try {
    const sql = `
      UPDATE OrderData SET
        Sales = @Sales,
        ComNo = @ComNo,
        OrderCom = @OrderCom,
        OrderNum = @OrderNum,
        OrderPro = @OrderPro,
        OrderSta = @OrderSta,
        OrderCurr = @OrderCurr,
        OrderAR = @OrderAR,
        OrderAL = @OrderAL
      WHERE YM = @YM
    `
    await ExecSQL(sql, { ...req.body, YM: req.params.ym })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 刪除訂單資料
router.delete('/:ym', async (req, res) => {
  try {
    const sql = 'DELETE FROM OrderData WHERE YM = @YM'
    await ExecSQL(sql, { YM: req.params.ym })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 獲取業務名稱列表
router.get('/salesnames', async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT Sales
      FROM OrderData WITH (NOLOCK)
      ORDER BY Sales
    `
    const result = await ExecSQL(sql)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
