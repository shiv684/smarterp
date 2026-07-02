const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "smarterp",
  password: "12345678",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("PostgreSQL connected successfully ✅");
  }
});

module.exports = pool;