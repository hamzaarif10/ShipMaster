const axios = require('axios');
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken'); 

const router = express.Router();

// Shopify GraphQL query to fetch unfulfilled orders
const getUnfulfilledOrdersQuery = `
  query getUnfulfilledOrders($first: Int!) {
  orders(first: $first, query: "fulfillment_status:unfulfilled") {
    edges {
      node {
        id
        name
        customer {
          firstName
          lastName
          email
          phone
        }
        shippingAddress {
          address1
          address2
          city
          province
          country
          zip
        }
        displayFulfillmentStatus
      }
    }
  }
}
`;

router.get("/orders/sync", async (req, res) => {
    const { shopifyDomain, shopifyAccessToken } = req.query; // Get these from query params
  
    if (!shopifyDomain || !shopifyAccessToken) {
      return res.status(400).json({ error: "Missing Shopify domain or access token." });
    }
    const url = `https://${shopifyDomain}/admin/api/2025-01/graphql.json`;
    console.log(url);
    console.log(shopifyAccessToken);
    try {
        const response = await axios.post(
          url,
          {
            query: getUnfulfilledOrdersQuery,
            variables: { first: 10 },
          },
          {
            headers: {
              'X-Shopify-Access-Token': shopifyAccessToken,
              "Content-Type": "application/json",
            },
          }
        );
      
        const orders = response.data.data.orders.edges.map((order) => order.node);
        res.json({ orders });
      } catch (error) {
        console.error("Error fetching unfulfilled orders:", error.response || error.message);
        res.status(500).json({ error: "Failed to fetch orders from Shopify." });
      }
  });
  
module.exports = router;