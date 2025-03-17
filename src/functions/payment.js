import axios from 'axios';
//authorize payment
export const authorizePayment = async (paymentAmount, currency = "cad") => {
    const token = localStorage.getItem("authToken");
    try {
      // Step 1: Authorize payment
      const response = await axios.post(
        "http://localhost:3001/payment/authorize",
        {
          amount: parseInt(paymentAmount) * 100, // Convert to cents
          currency // Default currency
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Step 2: Return the payment intent ID (or equivalent)
      const paymentIntentId = response.data.paymentIntentId;
      console.log("Payment authorized:", paymentIntentId);
      return { success: true, paymentIntentId }; // Pass the payment intent ID back
    } catch (error) {
      console.error("Payment authorization failed:", error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  };
  //Finalize the payment once shipment is created
export const capturePayment = async (paymentIntentId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/payment/capture",
        { paymentIntentId }
      );
      console.log("Payment captured successfully:", response.data);
      return true; // Capture was successful
    } catch (error) {
      console.error("Failed to capture payment:", error.response?.data || error.message);
      throw new Error("Payment capture failed");
    }
  };
  //if shipment creation fails, void the shipment and release the funds
  export const voidPayment = async (paymentIntentId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/payment/void",
        { paymentIntentId }
      );
      console.log("Payment voided successfully:", response.data);
      return true; // Void was successful
    } catch (error) {
      console.error("Failed to void payment:", error.response?.data || error.message);
      throw new Error("Payment voiding failed");
    }
  };
export default {authorizePayment, capturePayment, voidPayment};