import sql from "mssql";
import dotenv from "dotenv";

dotenv.config()

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export const pool = new sql.ConnectionPool(config)

export async function connectDB() {
  try {
    await pool.connect()
    console.log('Connected to MSSQL')
  } catch (err) {
    console.error('Database connection failed:', err)
    throw err
  }
}
