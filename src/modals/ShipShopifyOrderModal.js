import React, { useState, useEffect } from "react";
import { getEasyshipCreateShipmentData, getEasyshipRateEstimateData } from '../data/easyshipData';
import { fetchUserAddress } from "../functions/fetchUserAddress";
import { calculateRateWithMargin } from '../functions/calculateRate';
import GetRates from "../components/GetRates";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Grid,
  Divider,
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import RateEstimateForm from "../components/RateEstimateForm";

function ShipShopifyOrderModal({ isOpen, onClose, order }) {
    console.log("ShipShopifyOrderModal component is rendering!");
  //Sender data for rate estimate
     const [userAddressDetails, setUserAddressDetails] = useState(null);
     const [senderAddressLine1, setSenderAddressLine1] = useState("");
     const [senderProvince, setSenderProvince] = useState("");
     const [senderCity, setSenderCity] = useState("");
     const [senderPostalCode, setSenderPostalCode] = useState("");
     const [senderCompanyName, setSenderCompanyName] = useState("");
     const [senderContactName, setSenderContactName] = useState("");
     const [senderPhone, setSenderPhone] = useState("");
     const [senderEmail, setSenderEmail] = useState("");
     const [senderCountry, setSenderCountry] = useState("CA");
  //Form Data. (RECEIVER ADDRESS DETAILS)
  const [formData, setFormData] = useState({
    customerName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    email: "",
    phone: "",
    length: "",
    width: "",
    height: "",
    weight: "",
  });

  useEffect(() => {
    fetchUserAddress({setUserAddressDetails, setSenderAddressLine1, setSenderProvince,
      setSenderCity, setSenderPostalCode, setSenderCompanyName, setSenderContactName, setSenderPhone, setSenderEmail});
  }, []);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customer?.firstName + " " + order.customer?.lastName|| "",
        address1: order.shippingAddress?.address1 || "",
        city: order.shippingAddress?.city || "",
        province: order.shippingAddress?.province || "",
        postalCode: order.shippingAddress?.zip || "",
        country: order.shippingAddress?.country || "",
        email: order.customer?.email || "",
        phone: order.customer?.phone || "",
        length: "",
        width: "",
        height: "",
        weight: "",
      });
    }
  }, [order]);

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent borderRadius="md" p={4}>
        <ModalCloseButton />
        <ModalBody>
            {(order && formData.postalCode) && (
                <RateEstimateForm
                senderPostalCode={senderPostalCode}
                receiverAddressLine1={formData.address1}
                receiverCity={formData.city}
                receiverProvince={formData.province}
                receiverPostalCode={formData.postalCode}
                receiverName={formData.customerName}
                receiverPhoneNumber={formData.phone}
                receiverEmail={formData.email}
                />
            )}
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <Button onClick={onClose} ml={3} size="md" px={6} variant="outline">
            Cancel
          </Button>
        </ModalFooter>
        
      </ModalContent>
    </Modal>
  );
}

export default ShipShopifyOrderModal;






