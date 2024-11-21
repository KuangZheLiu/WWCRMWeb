const sqlConfig = require('../../config/setting.js').mssql.CRM
const msSql = require('mssql')

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

module.exports = {
  ExecSQL
}
