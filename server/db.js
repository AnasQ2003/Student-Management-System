const sql = require("mssql");

const config = {
  user: "nodeuser",
  password: "node123",
  server: "localhost",
  database: "sern_project",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true
  }
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

module.exports = connectDB;