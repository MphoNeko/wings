const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Default username for XAMPP MySQL
  password: '',     // Default password for XAMPP MySQL (blank)
  database: 'wings_cafe', // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Middleware
app.use(cors());
app.use(express.json());

// Get all products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Add a new product
app.post('/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, category, price, quantity], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, name, description, category, price, quantity });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
