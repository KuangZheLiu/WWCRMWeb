// import express from "express";
// import sql from "mssql";
// import { connectDB } from "../config/db";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const pool = await connectDB();
//     const result = await pool.request().query("SELECT * FROM Products");
//     res.json(result.recordset);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const { productName, unitPrice, categoryId } = req.body;
//     const pool = await connectDB();
//     const result = await pool
//       .request()
//       .input("productName", sql.NVarChar, productName)
//       .input("unitPrice", sql.Money, unitPrice)
//       .input("categoryId", sql.Int, categoryId).query(`
//         INSERT INTO Products (ProductName, UnitPrice, CategoryId)
//         VALUES (@productName, @unitPrice, @categoryId);
//         SELECT SCOPE_IDENTITY() AS id;
//       `);
//     res.json({ id: result.recordset[0].id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
