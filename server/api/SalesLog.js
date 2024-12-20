const express = require('express')
const router = express.Router()
const { ExecSQL } = require('./SqlPool')

// 獲取所有日誌
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT * FROM SalesLog
      ORDER BY Date DESC
    `
    const result = await ExecSQL(sql)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 新增日誌
router.post('/', async (req, res) => {
  try {
    const sql = `
      INSERT INTO SalesLog (Date, Sales, Customer, Product, ConName, ConNum, ConEmail, Status, Notes)
      VALUES (@Date, @Sales, @Customer, @Product, @ConName, @ConNum, @ConEmail, @Status, @Notes)
    `
    await ExecSQL(sql, req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 更新日誌
router.put('/:id', async (req, res) => {
  try {
    const sql = `
      UPDATE SalesLog
      SET Date = @Date,
          Sales = @Sales,
          Customer = @Customer,
          Product = @Product,
          ConName = @ConName,
          ConNum = @ConNum,
          ConEmail = @ConEmail,
          Status = @Status,
          Notes = @Notes
      WHERE id = @id
    `
    await ExecSQL(sql, { ...req.body, id: req.params.id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// 刪除日誌
router.delete('/:id', async (req, res) => {
  try {
    const sql = 'DELETE FROM SalesLog WHERE id = @id'
    await ExecSQL(sql, { id: req.params.id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
