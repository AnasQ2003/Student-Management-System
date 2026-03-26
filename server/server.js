const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const sql = require("mssql");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// GET students
app.get("/students", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM students");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ADD student
app.post("/students", async (req, res) => {
  try {
    const { name, email, course } = req.body;

    await sql.query(`
      INSERT INTO students (name, email, course)
      VALUES ('${name}', '${email}', '${course}')
    `);

    res.send("Student added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE student
app.put("/students/:id", async (req, res) => {

  const { name, email, course } = req.body;
  const id = req.params.id;

  try {

    const pool = await sql.connect();

    await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("course", sql.VarChar, course)
      .query(`
        UPDATE students
        SET name=@name, email=@email, course=@course
        WHERE id=@id
      `);

    res.send("Student updated successfully");

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

});

// DELETE student
app.delete("/students/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await sql.query(`DELETE FROM students WHERE id=${id}`);

    res.send("Student deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});