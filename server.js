const express = require('express');
const cors = require('cors');
require('dotenv').config();

const session = require('express-session');

const { connectToDatabase } = require('./db');
const authRoute = require('./routes/auth');
const userRoutes = require('./routes/user');
const rateRoutes = require('./routes/rates');
const fileUploadRoute = require('./routes/fileUpload');
const pickUpRoute = require('./routes/pickups');
const billingRoute = require('./routes/payment');
const shopifyIntegrationRoute = require('./routes/shopifyIntegration');
const fetchShopifyOrdersRoute = require('./routes/fetchShopifyOrders');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Session Middleware Configuration
app.use(session({
  secret: '5d41402abc4b2a76b9719d911017c592',  // Replace with a secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set `secure: true` for production (HTTPS)
}));

// Database Connection
connectToDatabase();

// Routes
app.use('/user', userRoutes);
app.use('/api', rateRoutes);
app.use('/auth', authRoute);
app.use('/fileUpload', fileUploadRoute);
app.use('/pickups', pickUpRoute);
app.use('/payment', billingRoute);
app.use('/auth', shopifyIntegrationRoute);
app.use('/fetchShopifyOrders', fetchShopifyOrdersRoute);


// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});