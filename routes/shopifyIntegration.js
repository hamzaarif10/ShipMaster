const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { getPool } = require('../db');
const sql = require('mssql');
const authenticateToken = require('../middleware/authenticateToken');  // Import your authenticateToken middleware

const SHOPIFY_API_KEY = '3213dab65821e57efe779dbf6da6e612';
const SHOPIFY_API_SECRET = '2bbe90f5eeef82294d64721cc133432e';
const SHOPIFY_SCOPES = 'read_orders,write_orders'; 
const SHOPIFY_REDIRECT_URI = 'https://f288-2001-4958-2fe0-c601-64bd-9d10-1fe4-35fb.ngrok-free.app/auth/callback';

const router = express.Router();

// Verifying the HMAC
function verifyHmac(queryParams) {
  const { hmac, ...params } = queryParams;
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const calculatedHmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest('hex');
  return hmac === calculatedHmac;
}
// Route to save Shopify domain to the database
router.post('/save-shopify-domain', authenticateToken, async (req, res) => {
  const { shopifyDomain } = req.body;

  if (!shopifyDomain) {
    return res.status(400).send("Shopify domain is required");
  }

  // Insert the Shopify domain into the database
  try {
    const pool = getPool();
    await pool.request()
      .input('shopify_domain', sql.VarChar(255), shopifyDomain)
      .input('id', sql.Int, req.user.id) // Get the user ID from the authenticated user (use JWT middleware)
      .query(`
        UPDATE Users 
        SET shopify_domain = @shopify_domain
        WHERE id = @id
      `);

    res.status(200).send("Shopify domain saved successfully");
  } catch (error) {
    console.error("Error saving Shopify domain:", error);
    res.status(500).send("Error saving Shopify domain");
  }
});
router.get('/get-shopify-auth-details', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id) // Get the logged-in user ID from the JWT
      .query(`
        SELECT shopify_domain, shopify_access_token 
        FROM Users 
        WHERE id = @id
      `);

    if (result.recordset.length > 0 && result.recordset[0].shopify_access_token) {
      res.json({ shopify_access_token: result.recordset[0].shopify_access_token,
                 shopify_domain: result.recordset[0].shopify_domain});
    } else {
      res.json({ shopify_access_token: null });
    }
  } catch (error) {
    console.error('Error fetching Shopify access token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Auth route
router.get('/auth', (req, res) => {
  const shopifyDomain = req.query.shop; // Shopify domain passed in query string (e.g., shop=myshop.myshopify.com)
  const redirectUri = SHOPIFY_REDIRECT_URI;

  // Generate the Shopify OAuth URL
  const oauthUrl = `https://${shopifyDomain}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_SCOPES}&redirect_uri=${redirectUri}`;
   
  // Respond with the OAuth URL
  res.json({ oauthUrl });
});
//Route for shopify callback
router.get('/callback', async (req, res) => {
  const { shop, code, state, hmac } = req.query;

  // Verify the HMAC to ensure the request is from Shopify
  if (!verifyHmac(req.query)) {
    console.error('HMAC verification failed');
    return res.status(400).send('Invalid request');
  }

  // Verify the 'state' to prevent CSRF attacks
  if (state !== req.query.state) {
    console.error('State parameter mismatch');
    return res.status(403).send('Request origin cannot be verified');
  }

  try {
    // Exchange the code for an access token from Shopify
    const tokenUrl = `https://${shop}/admin/oauth/access_token`;
    const params = {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code: code,
    };

    const response = await axios.post(tokenUrl, params);
    const { access_token, scope } = response.data;

    if (!access_token) {
      console.error('No access token received from Shopify');
      return res.status(500).send('Error receiving access token');
    }

    console.log(`Access token received: ${access_token}`);

    // Optionally, log the scopes to verify that they are correct
    console.log(`Access token scopes: ${scope}`);

    // Update the user's record with the access token and Shopify domain
    const pool = getPool();
    await pool.request()
      .input('shopify_access_token', sql.NVarChar(255), access_token)
      .input('shopify_domain', sql.NVarChar(255), shop)
      .query(`
        UPDATE Users 
        SET shopify_access_token = @shopify_access_token
        WHERE shopify_domain = @shopify_domain
      `);

    console.log(`User record updated for shop: ${shop}`);

    // Redirect to the integration page on the frontend
    res.redirect('http://localhost:3000/integration'); // Adjust to your frontend URL
  } catch (error) {
    console.error('Error during OAuth:', error);
    res.status(500).send('Error during OAuth');
  }
});


module.exports = router;


