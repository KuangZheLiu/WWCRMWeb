import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getProducts = async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT * FROM Products')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body

    const result = await pool.request()
      .input('name', name)
      .input('price', price)
      .input('categoryId', categoryId)
      .query(`
        INSERT INTO Products (Name, Price, CategoryId)
        VALUES (@name, @price, @categoryId);
        SELECT SCOPE_IDENTITY() AS id;
      `)

    res.status(201).json({ id: result.recordset[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
