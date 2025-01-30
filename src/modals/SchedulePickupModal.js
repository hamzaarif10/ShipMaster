import React, { useState } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

function SchedulePickupModal({ easyshipShipmentId, courierId, isOpen, onClose }) {
  const [pickupDate, setPickupDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const handleSchedule = async () => {

    const pickupData = {
      courier_service_id: courierId,
      selected_date: pickupDate,
      selected_from_time: fromTime,
      selected_to_time: toTime,
      easyship_shipment_ids: [easyshipShipmentId]
    }
    // Add logic here to handle the scheduling, such as sending data to an API
    // Make the Axios post request sending over the data to schedule pickup
    try {
      await axios.post(
        "http://localhost:3001/pickups/schedule-easyship-pickup",
        pickupData
      );
      Swal.fire({
        title: "Pickup Scheduled!",
        text: "Your pickup has been successfully scheduled.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Pick Up not scheduled",
        text: "Could not schedule pick up for the requested time slot. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Pickup</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>From Time</FormLabel>
            <Input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>To Time</FormLabel>
            <Input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSchedule}>
            Schedule
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SchedulePickupModal;
