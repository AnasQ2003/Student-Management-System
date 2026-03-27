import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Switch
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

function App() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  const [page, setPage] = useState(1);
  const studentsPerPage = 5;

  const colors = ["#ff6b6b", "#6bcB77", "#4d96ff", "#ffd93d"];

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students");

      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }

    } catch (error) {
      console.log(error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add student
  const addStudent = async () => {

    if (!name || !email || !course) return;

    await axios.post("http://localhost:5000/students", {
      name,
      email,
      course
    });

    fetchStudents();

    setName("");
    setEmail("");
    setCourse("");
  };

  // Delete student
  const deleteStudent = async (id) => {

    await axios.delete(`http://localhost:5000/students/${id}`);

    fetchStudents();
  };

  // Select student
  const selectStudent = (student) => {

    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setEditId(student.id);
  };

  // Update student
  const updateStudent = async () => {

    await axios.put(`http://localhost:5000/students/${editId}`, {
      name,
      email,
      course
    });

    fetchStudents();

    setName("");
    setEmail("");
    setCourse("");
    setEditId(null);
  };

  // Search
  const filteredStudents = students.filter((student) =>
    (student.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination
  const startIndex = (page - 1) * studentsPerPage;

  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + studentsPerPage
  );

  // Chart data
  const courseStats = Object.values(
    students.reduce((acc, student) => {

      const key = student.course || "Unknown";

      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }

      acc[key].value += 1;

      return acc;

    }, {})
  );

  return (

    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg,#141e30,#243b55)"
          : "linear-gradient(135deg,#6a11cb,#2575fc)",
        paddingTop: "40px"
      }}
    >

      <Container maxWidth="md">

        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Typography variant="h4" style={{ color: "white" }}>
              🎓 Student Dashboard
            </Typography>
          </motion.div>

          <Stack direction="row" alignItems="center">

            🌞

            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />

            🌙

          </Stack>

        </Stack>

        {/* SUMMARY CARDS */}

        <Stack direction="row" spacing={2} mt={3}>

          <Card sx={{ flex: 1, background: "#4caf50", color: "white" }}>
            <CardContent>
              <Typography>Total Students</Typography>
              <Typography variant="h4">{students.length}</Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: "#2196f3", color: "white" }}>
            <CardContent>
              <Typography>Total Courses</Typography>
              <Typography variant="h4">{courseStats.length}</Typography>
            </CardContent>
          </Card>

        </Stack>

        {/* ADD / UPDATE FORM */}

        <Card elevation={10} style={{ marginTop: "20px" }}>

          <CardContent>

            <Typography variant="h6">
              {editId ? "Update Student" : "Add Student"}
            </Typography>

            <Stack spacing={2} mt={2}>

              <TextField
                label="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />

              {editId ? (

                <Button
                  variant="contained"
                  color="warning"
                  onClick={updateStudent}
                >
                  Update Student
                </Button>

              ) : (

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PersonAddIcon />}
                  onClick={addStudent}
                >
                  Add Student
                </Button>

              )}

            </Stack>

          </CardContent>

        </Card>

        {/* SEARCH */}

        <TextField
          label="Search Student"
          fullWidth
          style={{ marginTop: "20px", background: "white" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CHART */}

        <Card elevation={10} style={{ marginTop: "20px" }}>

          <CardContent>

            <Typography variant="h6">
              Course Distribution
            </Typography>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={courseStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >

                  {courseStats.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={colors[index % colors.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* TABLE */}

        <Card elevation={10} style={{ marginTop: "20px" }}>

          <CardContent>

            <Table>

              <TableHead>

                <TableRow>

                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Action</TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {paginatedStudents.map((student) => (

                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >

                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.course}</TableCell>

                    <TableCell>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        style={{ marginRight: "10px" }}
                        onClick={() => selectStudent(student)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </Button>

                    </TableCell>

                  </motion.tr>

                ))}

              </TableBody>

            </Table>

            {/* PAGINATION */}

            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>

              <Button
                variant="contained"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                disabled={startIndex + studentsPerPage >= filteredStudents.length}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>

            </Stack>

          </CardContent>

        </Card>

      </Container>

    </div>

  );

}

export default App;