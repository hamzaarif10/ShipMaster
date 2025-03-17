import React, { useState, useEffect, useRef } from 'react';
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
import { Button, useDisclosure, Spinner, Input } from '@chakra-ui/react'; 
import loadGoogleMapsAPI from "../functions/loadGoogleMapsApi";
import initAutocomplete from "../functions/initAutoComplete";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { authorizePayment, capturePayment, voidPayment } from '../functions/payment';
import { generatePdfLink, submitLabel } from '../functions/generateLabel';
import { fetchUserAddress } from '../functions/fetchUserAddress';

function CreateShipmentForm({courierId, courierUrl, courierCost, senderCountry, receiverAddressLine1Prop, receiverCityProp, 
  receiverCountry, receiverPostCode, receiverName, receiverPhoneNumber, receiverEmailProp, measurements, mass}) {
  const [senderAddressLine1, setSenderAddressLine1] = useState("");
  const [senderProvince, setSenderProvince] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderPostalCode, setSenderPostalCode] = useState("");
  const [senderCompanyName, setSenderCompanyName] = useState("");
  const [senderContactName, setSenderContactName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverAddressLine1, setReceiverAddressLine1] = useState(receiverAddressLine1Prop);
  const [receiverProvince, setReceiverProvince] = useState("");
  const [receiverCity, setReceiverCity] = useState(receiverCityProp);
  const [receiverPostalCode, setReceiverPostalCode] = useState(receiverPostCode);
  const [receiverContactName, setReceiverContactName] = useState(receiverName);
  const [receiverPhone, setReceiverPhone] = useState(receiverPhoneNumber);
  const [receiverEmail, setReceiverEmail] = useState(receiverEmailProp);
  const [receiverCountryCode, setReceiverCountryCode] = useState(receiverCountry);
  const [weight, setWeight] = useState(mass);
  const [dimensions, setDimensions] = useState({ length: measurements.length, width: measurements.width, depth: measurements.depth });

  const [pdfLink, setPdfLink] = useState(null);
  const [shipmentDetails, setShipmentDetails] = useState(null);

  const [userAddressDetails, setUserAddressDetails] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null); // To track which modal to open

  // Load Stripe with your publishable key
   const stripePromise = loadStripe("pk_test_51QkCtpDHC1AwffPccIdFZDypLEY0aKWdk6af4qDDlwKALLJIVDuqeUcsXY2LHK5yrUPqu8tfFQPbB3YcRSsq6ONM00t568wLim");

  //Address autocomplete functionality
  useEffect(() => {
    loadGoogleMapsAPI(() => {
      initAutocomplete(setReceiverAddressLine1,setReceiverCity,setReceiverProvince, setReceiverPostalCode, receiverCountry);
    });
    console.log("receiver address: " + receiverAddressLine1);
  }, []);
  const handleProvinceChange = (e) => {
    setReceiverProvince(e.target.value);
  };

  const getProvincesOrStates = (countryCode) => {
    const countryMap = {
      "CA": canadianProvinces, "US": usStates, "GB": ukCountries, "AU": australianStates, "NZ": newZealandRegions,   
      "DE": germanStates, "FR": frenchRegions, "IT": italianRegions, "ES": spanishAutonomousCommunities, 
      "SE": swedishCounties, "NO": norwegianCounties, "DK": danishRegions, "FI": finnishRegions,"CH": swissCantons,        
      "JP": japanesePrefectures, "SG": singaporeRegions     
    };
    return countryMap[countryCode] || []; // Return empty array if country code is not found
  };
  // Inside your component
  const provinceOptions = getProvincesOrStates(receiverCountryCode);
//USE EFFECT HOOKS
useEffect(() => {
  if (modalType === "shipmentDetails" && isOpen) {
      submitLabel({
        shipment_id: shipmentDetails.easyship_shipment_id,
        name: receiverContactName,
        addressLine1: receiverAddressLine1,
        city: receiverCity,
        postalCode: receiverPostalCode,
        countryCode: receiverCountryCode,
        courierName: shipmentDetails.courierName,
        courierId: courierId,
        trackingNum: shipmentDetails.trackingNumber,
        pdfLink: pdfLink
      });
  }
}, [modalType, isOpen]);



useEffect(() => {
  fetchUserAddress({setUserAddressDetails, setSenderAddressLine1, setSenderProvince,
    setSenderCity, setSenderPostalCode, setSenderCompanyName, setSenderContactName, setSenderPhone, setSenderEmail});
}, [userAddressDetails]); // List the dependencies that trigger fetching address when they change.


const handleSubmit = async (e) => {
  e.preventDefault();
  setReceiverCountryCode(receiverCountry);
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
    let shipment_id = "";
    let courierName = "";
    let trackingNumber = "";
    let labelBase64 = "";
    //CORE LOGIC TO CREATE LABEL BASED ON THE COURIER SELECTED 
    if (courierId == "GlsDicomExpressGround")
    {
      const glsShipmentData = getGlsCreateShipmentData({
        senderAddressLine1, senderProvince, senderCity, senderPostalCode,
        senderCompanyName, senderContactName, senderPhone, senderEmail,
        receiverAddressLine1, receiverProvince, receiverCity, receiverPostalCode,
        receiverContactName, receiverPhone, receiverEmail, receiverCountryCode,
        dimensions, weight, courierId
      });
      const response = await axios.post(
        "http://localhost:3001/api/get-gls-label",
        glsShipmentData
      );
      shipment_id = response.data.trackingNumber;
      courierName = courierId;
      trackingNumber = response.data.carrierTrackingNos[0];

      
    }else{
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
      shipment_id = response.data.shipment.easyship_shipment_id;
      courierName = response.data.shipment.courier_service.name;
      trackingNumber = response.data.shipment.trackings[0].tracking_number;
      labelBase64 = response.data.shipment.shipping_documents?.[0]?.base64_encoded_strings?.[0];
    }

    if (trackingNumber) {
      // Step 3: Capture the payment
      const isCaptured = await capturePayment(paymentId);

      if (!isCaptured) {
        alert("Payment capture failed. Please contact support.");
        return;
      }
      console.log("Payment captured successfully");
      
      if (courierId == "GlsDicomExpressGround"){
        try {
          const response = await axios.get("http://localhost:3001/api/download-gls-label", {
            params: { shipment_id, documentSize: 'Thermal'}
          });
          console.log("label urL: " + response.data);
          await generatePdfLink(response.data.base64String, trackingNumber, setPdfLink);
        } catch (error) {
          console.error("Error fetching GLS label:", error);
        }
      }else{
        // Generate the PDF label
        await generatePdfLink(labelBase64, trackingNumber, setPdfLink);
      }
      // Set shipment details for the modal
      setShipmentDetails({
        easyship_shipment_id: shipment_id,
        courierName: courierName,
        trackingNumber: trackingNumber,
      });
      console.log("recipient name: " + receiverContactName);
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
                            fetchUserAddress({setUserAddressDetails, setSenderAddressLine1, setSenderProvince,
                              setSenderCity, setSenderPostalCode, setSenderCompanyName, setSenderContactName, setSenderPhone, setSenderEmail}); // Fetch updated address when modal closes
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
            style={{
              backgroundColor: 'lightgray', // Light gray background
            }}
            readOnly
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
                        readOnly
                        style={{
                          backgroundColor: 'lightgray', // Light gray background
                        }}
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
                            readOnly
                            style={{
                              backgroundColor: 'lightgray', // Light gray background
                            }}
                            onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}/>
                        <input type="number"
                            placeholder="Width"
                            value={dimensions.width}
                            readOnly
                            style={{
                              backgroundColor: 'lightgray', // Light gray background
                            }}
                            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}/>
                        <input type="number"
                            placeholder="Height"
                            value={dimensions.depth}
                            readOnly
                            style={{
                              backgroundColor: 'lightgray', // Light gray background
                            }}
                            onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })}/>
                    </div>
                </div>
                
                 
                    <button type="submit" className="submit-button">
                    Create Shipment
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