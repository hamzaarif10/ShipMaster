import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const UserAddressModal = ({ isOpen, onOpen, onClose }) => {
  const [senderAddressLine1, setSenderAddressLine1] = useState("");
  const [senderProvince, setSenderProvince] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [senderPostalCode, setSenderPostalCode] = useState("");
  const [senderCompanyName, setSenderCompanyName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  // Check if it's the user's first logon
  const checkAndShowModal = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:3001/user/isFirstLogon", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.isFirstLogin) {
        console.log("First login detected. Opening modal.");
        onOpen(); // Open the modal
      } else {
        console.log("Not the first login.");
      }
    } catch (error) {
      console.error("Error checking first logon:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    checkAndShowModal();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    try {
      // Update user address
      await axios.post(
        "http://localhost:3001/user/updateAddress",
        {
          userAddress: senderAddressLine1,
          userProvince: senderProvince,
          userCity: senderCity,
          userPostalCode: senderPostalCode,
          userCompanyName: senderCompanyName,
          userPhone: senderPhone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mark first logon as complete
      await axios.post(
        "http://localhost:3001/user/completeFirstLogon",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Form submitted successfully!");
      onClose(); // Close the modal
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to update information.");
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Please enter your address:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="input-group">
            <label htmlFor="senderAddressLine1">Address Line 1</label>
            <input
              type="text"
              id="senderAddressLine1"
              value={senderAddressLine1}
              onChange={(e) => setSenderAddressLine1(e.target.value)}
              placeholder="Enter your address"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senderProvince">Province</label>
            <select
              id="senderProvince"
              value={senderProvince}
              onChange={(e) => setSenderProvince(e.target.value)}
            >
              <option value="" disabled>
                Select your province
              </option>
              <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="YT">Yukon</option>
              
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="senderCity">City</label>
            <input
              type="text"
              id="senderCity"
              value={senderCity}
              onChange={(e) => setSenderCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senderPostalCode">Postal Code</label>
            <input
              type="text"
              id="senderPostalCode"
              value={senderPostalCode}
              onChange={(e) => setSenderPostalCode(e.target.value)}
              placeholder="Enter your postal code"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senderCompanyName">Company Name</label>
            <input
              type="text"
              id="senderCompanyName"
              value={senderCompanyName}
              onChange={(e) => setSenderCompanyName(e.target.value)}
              placeholder="Enter your company name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senderPhone">Phone</label>
            <input
              type="text"
              id="senderPhone"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserAddressModal;
