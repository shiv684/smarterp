const { Pool } = require("pg");

// Create connection pool to PostgreSQL
const pool = new Pool({
  user: "postgres",       // PostgreSQL username
  host: "localhost",      // Database host
  database: "smarterp",  // Database name
  password: "12345678",  // Database password
  port: 5432,            // PostgreSQL default port
});

// Check if database connected successfully
pool.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("PostgreSQL connected successfully ✅");
  }
});

module.exports = pool;