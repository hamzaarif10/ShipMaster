const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToDatabase } = require('./db');
const authRoute = require('./routes/auth');
const userRoutes = require('./routes/user');
const rateRoutes = require('./routes/rates');
const fileUploadRoute = require('./routes/fileUpload');
const pickUpRoute = require('./routes/pickups');
const billingRoute = require('./routes/payment');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectToDatabase();

// Routes
app.use('/user', userRoutes);
app.use('/api', rateRoutes);
app.use('/auth', authRoute);
app.use('/fileUpload', fileUploadRoute);
app.use('/pickups', pickUpRoute);
app.use('/payment', billingRoute);



// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});