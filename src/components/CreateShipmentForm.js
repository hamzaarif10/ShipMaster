import React, { useState, useEffect } from 'react';
import "../styles/RenderRates.css";
import axios from 'axios';
import ShipmentDetailsModal from '../modals/ShipmentDetailsModal';
import UserAddressModal from '../modals/UserAddressModal';
import AddPaymentMethodModal from '../modals/AddPaymentMethodModal';
import { getEasyshipCreateShipmentData } from '../data/easyshipData';
import { getGlsCreateShipmentData } from '../data/glsData';
import { canadianProvinces, usStates, ukCountries, australianStates, newZealandRegions, germanStates, frenchRegions, 
  italianRegions, spanishAutonomousCommunities, swedishCounties, norwegianCounties,  
  danishRegions, finnishRegions, swissCantons, japanesePrefectures, singaporeRegions} from '../data/locationData';
import { Button, useDisclosure } from '@chakra-ui/react'; 
import loadGoogleMapsAPI from "../functions/loadGoogleMapsApi";
import initAutocomplete from "../functions/initAutoComplete";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function CreateShipmentForm({courierId, courierUrl, courierCost, receiverCountry, receiverPostCode, measurements, mass}) {
  const [senderAddressLine1, setSenderAddressLine1] = useState("");
  const [senderProvince, setSenderProvince] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderPostalCode, setSenderPostalCode] = useState("");
  const [senderCompanyName, setSenderCompanyName] = useState("");
  const [senderContactName, setSenderContactName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverAddressLine1, setReceiverAddressLine1] = useState("");
  const [receiverProvince, setReceiverProvince] = useState("");
  const [receiverCity, setReceiverCity] = useState("");
  const [receiverPostalCode, setReceiverPostalCode] = useState(receiverPostCode);
  const [receiverContactName, setReceiverContactName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverCountryCode, setReceiverCountryCode] = useState(receiverCountry);
  const [weight, setWeight] = useState(mass);
  const [dimensions, setDimensions] = useState({ length: measurements.length, width: measurements.width, depth: measurements.depth });

  const [pdfLink, setPdfLink] = useState(null);
  const [shipmentDetails, setShipmentDetails] = useState(null);

  const [userAddressDetails, setUserAddressDetails] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null); // To track which modal to open
  const [isLoading, setIsLoading] = useState(false);

  // Load Stripe with your publishable key
   const stripePromise = loadStripe("pk_test_51QkCtpDHC1AwffPccIdFZDypLEY0aKWdk6af4qDDlwKALLJIVDuqeUcsXY2LHK5yrUPqu8tfFQPbB3YcRSsq6ONM00t568wLim");

  //Address autocomplete functionality
  useEffect(() => {
    loadGoogleMapsAPI(() => {
      initAutocomplete(setReceiverAddressLine1,setReceiverCity,setReceiverProvince, setReceiverPostalCode, receiverCountry);
    });
  }, []);
  const handleProvinceChange = (e) => {
    setReceiverProvince(e.target.value);
  };


  const getProvincesOrStates = (countryCode) => {
    const countryMap = {
      "CA": canadianProvinces,   // Canada
      "US": usStates,            // United States
      "GB": ukCountries,         // United Kingdom
      "AU": australianStates, // Australia
      "NZ": newZealandRegions,   // New Zealand
      "DE": germanStates,        // Germany
      "FR": frenchRegions,       // France
      "IT": italianRegions,      // Italy
      "ES": spanishAutonomousCommunities, // Spain
      "SE": swedishCounties,     // Sweden
      "NO": norwegianCounties,   // Norway
      "DK": danishRegions,       // Denmark
      "FI": finnishRegions,      // Finland
      "CH": swissCantons,        // Switzerland
      "JP": japanesePrefectures, // Japan
      "SG": singaporeRegions     // Singapore
    };
  
    return countryMap[countryCode] || []; // Return empty array if country code is not found
  };
  
  // Inside your component
  const provinceOptions = getProvincesOrStates(receiverCountryCode);


  // Fetch user address details from db
async function fetchUserAddress() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await axios.get("http://localhost:3001/user/getUserAddress", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });
    const newAddress = response.data.userAddressDetails;
    if (JSON.stringify(newAddress) !== JSON.stringify(userAddressDetails)) {
      setUserAddressDetails(newAddress);
      setSenderAddressLine1(newAddress.userAddress);
      setSenderProvince(newAddress.userProvince);
      setSenderCity(newAddress.userCity);
      setSenderPostalCode(newAddress.userPostalCode);
      setSenderCompanyName(newAddress.userCompanyName);
      setSenderContactName(newAddress.userCompanyName);
      setSenderPhone(newAddress.userPhone);
      setSenderEmail(newAddress.email);
    }
  } catch (error) {
    console.error("Error fetching user address:", error);
  }
}
//authorize payment
const authorizePayment = async (paymentAmount, currency = "cad") => {
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
const capturePayment = async (paymentIntentId) => {
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
const voidPayment = async (paymentIntentId) => {
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
// Submit shipment label details to the database
async function submitLabel() {
  const token = localStorage.getItem("authToken");
  try {
    await axios.post(
      "http://localhost:3001/user/submitLabel",
      {
        easyship_shipment_id: shipmentDetails.easyship_shipment_id,
        recipientName: receiverContactName,
        recipientAddress: `${receiverAddressLine1}, ${receiverCity}, ${receiverPostalCode}, ${receiverCountryCode}`,
        courierName: shipmentDetails.courierName,
        courierServiceId: courierId,
        trackingNumber: shipmentDetails.trackingNumber,
        pdf_url: pdfLink
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to submit label.");
  }
}

useEffect(() => {
    fetchUserAddress();
}, [userAddressDetails]); // List the dependencies that trigger fetching address when they change.
  
async function generatePdfLink(base64String, tracking, isEasyShipLabel) {
  try {
    let blob = null;
    if (isEasyShipLabel){
    // Clean up the Base64 string (remove any extra spaces or newlines)
    const sanitizedBase64String = base64String.trim();

    // Decode Base64 to a byte array
    const byteCharacters = atob(sanitizedBase64String);
    const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
      // Create a Blob from the byte array
      blob = new Blob([byteArray], { type: "application/pdf" });
    }else{
      blob = new Blob([base64String], { type: "application/pdf" });
    }
    // Convert Blob to a File (required for some storage APIs)
    const file = new File([blob], `${tracking}.pdf`, {
      type: "application/pdf",
    });
    // Upload the file to permanent storage (e.g., AWS S3)
    const permanentUrl = await uploadFileToStorage(file);
    console.log("PDF URL generated successfully:", permanentUrl);

    // Set the URL in state for immediate use
    setPdfLink(permanentUrl);
  } catch (error) {
    console.error("Error generating PDF link:", error);
  }
}
//upload file to AWS storage
async function uploadFileToStorage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Send the request using Axios
    const response = await axios.post("http://localhost:3001/fileUpload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure content type is set correctly
      },
    });

    // Assuming the server responds with the file's permanent URL
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
}
useEffect(() => {
  if (shipmentDetails) {
    submitLabel();
  }
}, [shipmentDetails]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setReceiverCountryCode(receiverCountry);
  setIsLoading(true); // Show loading indicator
  // Check to see if there is a payment method on file, if not open add payment method modal
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:3001/payment/doesPaymentMethodExist", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    if (!response.data.doesPaymentMethodExist) {
      setModalType("paymentMethod");
      onOpen();
      setIsLoading(false);
      return; // Exit the function if stripe_customer_id is null
    }
    // Proceed with further logic if needed
  } catch (error) {
    console.error("Error checking payment method:", error.response?.data || error.message);
  }

  //continue with payment
  let paymentId = "";
  try {
    // Step 1: Authorize payment
    const paymentAmount = courierCost; // Use the courierCost for payment
    const { success: isAuthorized, paymentIntentId, error } = await authorizePayment(paymentAmount);

    if (!isAuthorized) {
      alert(`Payment authorization failed: ${error}`);
      return;
    }

    console.log("Payment authorized successfully:", paymentIntentId);
    paymentId = paymentIntentId; // Assign paymentIntentId here
    if (!paymentId) {
      throw new Error('PaymentIntent ID is missing');
    }
    // Step 2: Proceed to create the shipment
    setModalType("shipmentDetails");

    const easyShipShipmentData = getEasyshipCreateShipmentData({
      senderAddressLine1, senderProvince, senderCity, senderPostalCode,
      senderCompanyName, senderContactName, senderPhone, senderEmail,
      receiverAddressLine1, receiverProvince, receiverCity, receiverPostalCode,
      receiverContactName, receiverPhone, receiverEmail, receiverCountryCode,
      dimensions, weight, courierId
    });

    const response = await axios.post(
      "http://localhost:3001/api/get-easyship-label",
      easyShipShipmentData
    );

    // Extract shipment details
    const easyship_shipment_id = response.data.shipment.easyship_shipment_id;
    const courierName = response.data.shipment.courier_service.name;
    const trackingNumber = response.data.shipment.trackings[0].tracking_number;
    const labelBase64 =
      response.data.shipment.shipping_documents?.[0]?.base64_encoded_strings?.[0];

    if (labelBase64 && trackingNumber) {
      // Step 3: Capture the payment
      const isCaptured = await capturePayment(paymentId);

      if (!isCaptured) {
        alert("Payment capture failed. Please contact support.");
        return;
      }
      console.log("Payment captured successfully");

      // Generate the PDF label
      await generatePdfLink(labelBase64, trackingNumber, true);
      // Set shipment details for the modal
      setShipmentDetails({
        easyship_shipment_id: easyship_shipment_id,
        courierName: courierName,
        trackingNumber: trackingNumber,
      });
      // Open the modal
      onOpen();
    } else {
      console.error("Base64 encoded string for label not found.");
      alert("Shipment label generation failed.");
    }
  } catch (error) {
    console.error("Error in shipment creation:", error);
    // Step 4: Void the payment if shipment creation fails
    if (paymentId) {
      try {
        await voidPayment(paymentId);
        console.log("Payment voided successfully");
      } catch (voidError) {
        console.error("Failed to void payment:", voidError.message);
      }
    }
    alert("Failed to create shipment.");
  } finally {
    setIsLoading(false); // Hide loading indicator
  }
};
    return (
               <div className="shipping-form-container">
                    <form onSubmit={handleSubmit} className="shipping-form">
                    <div className="courier-info">
                  <h2 className="form-title" style={{color:"black"}}>Create Shipment</h2>
                  <div className="courier-details">
                    <div className="courier-image">
                      <img src={courierUrl} alt="GLS Logo" className="gls-logo" />
                    </div>
                    <div className="courier-cost">
                      <h3>$ {courierCost}</h3>
                    </div>
                  </div>
                </div>
                {/* Sender and Receiver Info */}
                <div className="sender-receiver-container">
                <div className="input-group">
                        <h3>Ship From: <Button
                          onClick={() => {
                          setModalType('userAddress');
                          onOpen();
                        }}
                        style={{color: "blue", backgroundColor: "cyan"}}
                      >
                        Change
                      </Button></h3>
                        {userAddressDetails
                        ? `${userAddressDetails.userAddress}, ${userAddressDetails.userPostalCode}`
                        : "Loading..."}
                        {/* Button in Parent Component triggers the modal */}
                        
      
                      {modalType === 'userAddress' && (
                        <UserAddressModal 
                          isOpen={isOpen} 
                          onOpen={onOpen} 
                          onClose={() => {
                            onClose();
                            fetchUserAddress(); // Fetch updated address when modal closes
                            setModalType(null); // Reset modalType when modal closes
                          }}  
                        />
                      )}
                        </div>     
                        <h3>Ship To:</h3>
                    <div className="sender-info">
                    <div className="input-group">
          <label htmlFor="receiverAddressLine1">Receiver Address</label>
          <input
            type="text"
            id="receiverAddressLine1"
            value={receiverAddressLine1}
            onChange={(e) => setReceiverAddressLine1(e.target.value)}
            placeholder="Enter receiver's address"
          />
        </div>

        {/* Receiver City */}
        <div className="input-group">
          <label htmlFor="receiverCity">Receiver City</label>
          <input
            type="text"
            id="receiverCity"
            value={receiverCity}
            onChange={(e) => setReceiverCity(e.target.value)}
            placeholder="Enter receiver's city"
          />
        </div>

        {/* Receiver Province */}
        <div className="input-group">
          <label htmlFor="receiverProvince">Receiver Province</label>
          <select value={receiverProvince} onChange={handleProvinceChange}>
            <option value="">Select a Province/State</option>
            {provinceOptions.map((province, index) => (
              <option key={index} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* Receiver Postal Code */}
        <div className="input-group">
          <label htmlFor="receiverPostalCode">Receiver Postal Code</label>
          <input
            type="text"
            id="receiverPostalCode"
            value={receiverPostalCode}
            onChange={(e) => setReceiverPostalCode(e.target.value)}
          />
        </div>
                    </div>
                    <div className="receiver-info">
                    
                        <div className="input-group">
                            <label htmlFor="receiverContactName">Receiver Contact Name</label>
                            <input type="text"
                                id="receiverContactName"
                                value={receiverContactName}
                                onChange={(e) => setReceiverContactName(e.target.value)}
                                placeholder="Enter receiver's contact name"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="receiverPhone">Phone Number</label>
                            <input type="text"
                                id="receiverPhone"
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                placeholder="Enter receiver's phone number"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="receiverEmail">Email</label>
                            <input type="text"
                                id="receiverEmail"
                                value={receiverEmail}
                                onChange={(e) => setReceiverEmail(e.target.value)}
                                placeholder="Enter receiver's email"/>
                        </div>
                        <div className="input-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        placeholder="Enter weight in kg"/>
                </div>
                    </div>
                </div>
                
                <div className="input-group">
                    <label>Dimensions (cm)</label>
                    <div className="dimensions-inputs">
                        <input type="number"
                            placeholder="Length"
                            value={dimensions.length}
                            onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}/>
                        <input type="number"
                            placeholder="Width"
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}/>
                        <input type="number"
                            placeholder="Height"
                            value={dimensions.depth}
                            onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })}/>
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="submit-button">
                      {isLoading ? "Processing..." : "Create Shipment"}
                    </button>
            </form>
            {/* Render ShipmentDetailsModal only if pdfLink and shipmentDetails are set */}
        {shipmentDetails && modalType === 'shipmentDetails' &&(
            <ShipmentDetailsModal 
                recipientName={receiverContactName}
                recipientAddress={receiverAddressLine1}
                courierName={shipmentDetails.courierName} 
                trackingNumber={shipmentDetails.trackingNumber} 
                pdfLink={pdfLink} 
                isOpen={isOpen}
                onClose={onClose}
            />
        )}
        {/* Render add payment method modal  */}
        {modalType === 'paymentMethod' && (
          <Elements stripe={stripePromise}>
              <AddPaymentMethodModal 
                  isOpen={isOpen} 
                  onClose={() => {
                    onClose();
                    setModalType(null); // Reset modalType when modal closes
                    }}  
              /> </Elements>)}
        </div>
    );
  }
export default CreateShipmentForm;