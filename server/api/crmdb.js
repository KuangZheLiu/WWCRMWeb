// Create connection to database
const sqlConfig = require('../../config/setting.js').mssql.CRM
const msSql = require('mssql')

const express = require('express')
const router = express.Router()

// 建立連接池
const pool = new msSql.ConnectionPool(sqlConfig)
const poolConnect = pool.connect()

// 初始化連接池
pool.on('error', (err) => {
  console.error('數據庫連接池錯誤:', err)
})

async function ExecSQL(SqlStr, params = {}) {
  try {
    await poolConnect
    const request = pool.request()

    // 為每個參數添加到請求中
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'ComNo') {
        request.input(key, msSql.NVarChar(30), value)
      } else if (key === 'offset' || key === 'pageSize') {
        request.input(key, msSql.Int, value)
      } else if (key === 'Amount') {
        request.input(key, msSql.Decimal(18, 2), value)
      } else if (key === 'YM') {
        request.input(key, msSql.NVarChar(6), value?.toString())
      } else if (typeof value === 'number') {
        request.input(key, msSql.Float, value)
      } else if (value instanceof Date) {
        request.input(key, msSql.DateTime, value)
      } else {
        request.input(key, msSql.NVarChar, value?.toString() || '')
      }
    })

    console.log('執行 SQL:', SqlStr)
    console.log('參數:', params)

    const result = await request.query(SqlStr)
    return result
  } catch (err) {
    console.error('SQL 執行錯誤:', err)
    throw err
  }
}

// 路由處理
router.get('/dbquery', async (req, res) => {
  try {
    const SqlStr = 'SELECT TOP 2 * FROM InvData'
    const result = await ExecSQL(SqlStr)
    res.json({
      success: true,
      data: result,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 參數化查詢示例
router.get('/dbquery/:ym', async (req, res) => {
  try {
    const SqlStr = 'SELECT * FROM InvData WHERE YM = @ym'
    const params = {
      ym: req.params.ym,
    }
    const result = await ExecSQL(SqlStr, params)
    res.json({
      success: true,
      data: result,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 簡單查詢
// const result1 = await ExecSQL('SELECT * FROM InvData');

// 帶參數的查詢
// const result2 = await ExecSQL(
//   'SELECT * FROM InvData WHERE Category = @category AND Price > @price',
//   {
//     category: 'Electronics',
//     price: 100
//   }
// );

// API 路由
// 1. 查詢資料
router.get('/data/:table', async (req, res) => {
  try {
    const table = req.params.table
    const { YM, Category } = req.query
    let { page = 1, pageSize = 10 } = req.query

    // 確保 page 和 pageSize 是整數
    page = parseInt(page)
    pageSize = parseInt(pageSize)
    const offset = (page - 1) * pageSize

    // 構建查詢條件
    let whereClause = '1=1'
    const params = {
      offset,
      pageSize,
    }

    if (YM) {
      whereClause += ' AND YM = @YM'
      params.YM = YM
    }

    if (Category) {
      whereClause += ' AND Category = @Category'
      params.Category = Category
    }

    // 查詢總數
    const countSql = `
      SELECT COUNT(*) as total
      FROM ${table}
      WHERE ${whereClause}
    `
    const countResult = await ExecSQL(countSql, params)
    const total = countResult.recordset[0].total

    // 查詢數據
    const dataSql = `
      SELECT *
      FROM ${table}
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
      page,
      pageSize,
    })
  } catch (err) {
    console.error('查詢錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 2. 新增資料
router.post('/data/:table', async (req, res) => {
  try {
    const table = req.params.table
    const data = req.body

    // 驗證表名（可選：加入白名單檢查）
    const allowedTables = ['TestTable', 'InvData'] // 允許的表名列表
    if (!allowedTables.includes(table)) {
      throw new Error('不允許的表名')
    }

    // 打印接收到的數據
    console.log('接收到的數據:', data)

    // 驗證必要欄位
    if (!data.YM || !data.Category) {
      throw new Error('缺少必要欄位')
    }

    // SQL 查詢構建
    const SqlStr = `
      INSERT INTO ${table}
        (YM, Category, Amount, Remark)
      VALUES
        (@YM, @Category, @Amount, @Remark)
    `

    // 參數對象
    const params = {
      YM: data.YM,
      Category: data.Category,
      Amount: parseFloat(data.Amount) || 0,
      Remark: data.Remark || '',
    }

    // 執行 SQL
    const result = await ExecSQL(SqlStr, params)

    // 返回成功響應
    res.json({
      success: true,
      message: '資料新增成功',
      data: {
        ...params,
        id: result.insertId, // 如果數據庫返回插入ID
      },
    })
  } catch (err) {
    // 錯誤處理
    console.error('新增資料錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message || '新增資料失敗',
    })
  }
})

// 3. 更新資料
router.put('/data/:table/:ym', async (req, res) => {
  try {
    const { table, ym } = req.params
    const data = req.body

    // 構建更新語句
    const SqlStr = `
      UPDATE ${table}
      SET Category = @Category,
          Amount = @Amount,
          Remark = @Remark
      WHERE YM = @YM
    `

    // 構建參數對象
    const params = {
      Category: data.Category,
      Amount: parseFloat(data.Amount) || 0,
      Remark: data.Remark || '',
      YM: ym, // 使用路由參數中的 YM 值
    }

    const result = await ExecSQL(SqlStr, params)

    if (result.rowsAffected[0] > 0) {
      res.json({
        success: true,
        message: '更新成功',
        data: params,
      })
    } else {
      res.status(404).json({
        success: false,
        error: '找不到要更新的記錄',
      })
    }
  } catch (err) {
    console.error('更新錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 4. 刪除資料
router.delete('/data/:table/:ym', async (req, res) => {
  try {
    const { table, ym } = req.params
    const SqlStr = `DELETE FROM ${table} WHERE YM = @YM`
    const params = { YM: ym }

    const result = await ExecSQL(SqlStr, params)

    if (result.rowsAffected[0] > 0) {
      res.json({
        success: true,
        message: '刪除成功',
      })
    } else {
      res.status(404).json({
        success: false,
        error: '找不到要刪除的記錄',
      })
    }
  } catch (err) {
    console.error('刪除錯誤:', err)
    res.status(500).json({
      success: false,
      error: err.message,
    })
  }
})

// 篩選
router.get('/data/:table', async (req, res) => {
  try {
    const table = req.params.table
    const { YM, Category } = req.query

    let SqlStr = `SELECT * FROM ${table} WHERE 1=1`
    const params = {}

    if (YM) {
      SqlStr += ' AND YM = @YM'
      params.YM = YM
    }

    if (Category) {
      SqlStr += ' AND Category = @Category'
      params.Category = Category
    }

    const result = await ExecSQL(SqlStr, params)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 5. 自定義查詢
router.post('/query', async (req, res) => {
  try {
    const { sql } = req.body
    const result = await ExecSQL(sql, sqlConfig)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

// 優雅關閉連接池
process.on('SIGINT', async () => {
  try {
    await pool.close()
    console.log('數據庫連接池已關閉')
    process.exit(0)
  } catch (err) {
    console.error('關閉連接池時發生錯誤:', err)
    process.exit(1)
  }
})
