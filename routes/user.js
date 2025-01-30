const express = require('express');
const { getPool } = require('../db');
const sql = require('mssql');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();
//Submit label to database route
router.post('/submitLabel', authenticateToken, async (req, res) => {
  const {easyship_shipment_id, recipientName, recipientAddress, courierName, courierServiceId, trackingNumber, pdf_url} = req.body;
  const userId = req.user.id;
  try{
      const pool = getPool();
      await pool.request()
       .input('user_id', sql.Int, userId)
       .input('easyship_shipment_ids', sql.NVarChar(255), easyship_shipment_id)
       .input('recipient_name', sql.NVarChar(255), recipientName)
       .input('recipient_address', sql.NVarChar(255), recipientAddress)
       .input('courier_name', sql.NVarChar(50), courierName)
       .input('courier_service_id', sql.NVarChar(255), courierServiceId)
       .input('tracking_number', sql.NVarChar(255), trackingNumber)
       .input('pdf_url', sql.NVarChar(sql.MAX), pdf_url)
       .query('INSERT INTO Labels (user_id, easyship_shipment_ids, recipient_name, recipient_address, courier_name, courier_service_id, tracking_number, pdf_url) VALUES (@user_id, @easyship_shipment_ids, @recipient_name, @recipient_address, @courier_name, @courier_service_id, @tracking_number, @pdf_url)');

    res.status(201).json({ message: 'Label Submitted successfully' });
  }catch(error)
  {
    console.error('SQL error:', error);
    res.status(500).json({ message: 'Failed to submit label' });
  }

})
// Update user address route
router.post('/updateAddress', authenticateToken, async (req, res) => {
  const {userAddress, userProvince, userCity, userPostalCode, userCompanyName, userPhone } = req.body;
  const userId = req.user.id;
  try {
    const pool = getPool();
    await pool.request()
      .input('userAddress', sql.VarChar(255), userAddress)
      .input('userProvince', sql.VarChar(2), userProvince)
      .input('userCity', sql.VarChar(100), userCity) 
      .input('userPostalCode', sql.VarChar(10), userPostalCode)
      .input('userCompanyName', sql.VarChar(255), userCompanyName)
      .input('userPhone', sql.VarChar(20), userPhone)
      .input('id', sql.Int, userId) // Ensure userId is passed as a parameter
      .query(`
        UPDATE Users
        SET 
            userAddress = @userAddress,
            userProvince = @userProvince,
            userCity = @userCity,
            userPostalCode = @userPostalCode,
            userCompanyName = @userCompanyName,
            userPhone = @userPhone
        WHERE id = @id
      `);
    res.status(201).json({ message: 'User Address Updated Successfully!' });
  } catch (error) {
    console.error('SQL error:', error);
    res.status(500).json({ message: 'Failed to update address.' });
  }
});
// Route to update the `isFirstLogon` field
router.post("/completeFirstLogon", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is populated by `authenticateToken`
    const pool = getPool();
    // Update `isFirstLogon` to false
    const result = await pool.request()
      .input('id', sql.Int, userId) // Specify the userId parameter with its type
      .query("UPDATE Users SET isFirstLogin = 0 WHERE id = @id"); // Use @id as the parameter

    // Check if the update was successful
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found or already updated." });
    }

    res.status(200).json({ message: "First logon process completed successfully!" });
  } catch (error) {
    console.error("Error updating first logon status:", error.message);
    res.status(500).json({ message: "Failed to update first logon status.", error: error.message });
  }
});
// Route to check if it's the user's first logon
router.get("/isFirstLogon", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const pool = getPool();
    
    // Query to check the `isFirstLogin` status
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT isFirstLogin FROM Users WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    const isFirstLogin = result.recordset[0].isFirstLogin;

    // Respond with the `isFirstLogin` status
    res.status(200).json({ isFirstLogin });
  } catch (error) {
    console.error("Error checking first logon:", error.message);
    res.status(500).json({ message: "Failed to check first logon.", error: error.message });
  }
});
//Get the user address on file and display it on create shipment page
router.get("/getUserAddress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const pool = getPool();
    
    // Query to check the `isFirstLogin` status
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT email, userAddress, userProvince, userCity, userPostalCode, userCompanyName, userPhone FROM Users WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "address not found." });
    }
    const userAddressDetails = result.recordset[0];
    // Respond with the `isFirstLogin` status
    res.status(200).json({ userAddressDetails });
  } catch (error) {
    console.error("Error getting user address:", error.message);
    res.status(500).json({ message: "Failed to fetch address.", error: error.message });
  }
});
//Get shipping labels for view labels route
router.get("/getShippingLabels", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const pool = getPool();

    const result = await pool.request()
      .input('user_id', sql.Int, userId)
      .query('SELECT easyship_shipment_ids, recipient_name, recipient_address, courier_name, courier_service_id, tracking_number, pdf_url FROM Labels WHERE user_id = @user_id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "labels not found." });
    }
    const shippingLabelDetails = result.recordset;
    res.status(200).json({ shippingLabelDetails });
  } catch (error) {
    console.error("Error getting shipping label details:", error.message);
    res.status(500).json({ message: "Failed to fetch shipping label details.", error: error.message });
  }
});
//Fetch user Account details
router.get("/getAccountDetails", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the token
    const pool = getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT firstName, email, userAddress, userProvince, userCity, userPostalCode, userCompanyName, userPhone FROM Users WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No account details found." });
    }
    const userAccountDetails = result.recordset[0];
    res.status(200).json({ userAccountDetails });
  } catch (error) {
    console.error("Error getting user account details:", error.message);
    res.status(500).json({ message: "Failed to fetch account details.", error: error.message });
  }
});
module.exports = router;
