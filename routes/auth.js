const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../db');
const sql = require('mssql');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { firstName, email, password } = req.body;

  try {
    const pool = getPool();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password here
    await pool.request()
      .input('firstName', sql.VarChar(50), firstName)
      .input('email', sql.VarChar(50), email)
      .input('password', sql.VarChar(100), hashedPassword) // Store hashed password
      .query('INSERT INTO Users (firstName, email, password) VALUES (@firstName, @email, @password)');
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('SQL error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (result.recordset.length === 0) return res.status(404).send('User not found');

    const user = result.recordset[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).send('Invalid password');

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Store JWT token in the session
    req.session.token = token; // This saves the JWT in the session

    // Send the token back as a response (optional, if you want the frontend to receive it)
    res.json({ token }); // You can remove this if you prefer to only rely on session-based auth
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error logging in');
  }
});

  module.exports = router;