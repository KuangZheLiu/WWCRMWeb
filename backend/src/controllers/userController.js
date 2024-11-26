import { Request, Response } from 'express'
import { pool } from '../config/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await pool.request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE Username = @username')

    const user = result.recordset[0]

    if (!user || !(await bcrypt.compare(password, user.Password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.Id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      user: {
        id: user.Id,
        username: user.Username,
        email: user.Email
      },
      token
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.request()
      .input('username', username)
      .input('email', email)
      .input('password', hashedPassword)
      .query(`
        INSERT INTO Users (Username, Email, Password)
        VALUES (@username, @email, @password);
        SELECT SCOPE_IDENTITY() AS id;
      `)

    res.status(201).json({ id: result.recordset[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
