import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

function SchedulePickupModal({ easyshipShipmentId, courierId, isOpen, onClose }) {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [formattedPickupTimes, setFormattedPickupTimes] = useState([]);
  const [pickupSlotId, setPickupSlotId] = useState("");

  const getPickupTime = async () => {
    try {
      const response = await axios.get('http://localhost:3001/pickups/get-time-slots', {
        params: { courier_service_id: courierId }
      });

      // Extract and format the time slots as "from_time - to_time"
      const pickupSlots = response.data.courier_service_handover_option.pickup_slots;

      // Filter and map the pickup slots to format them
      const formattedTimes = pickupSlots.filter(slot => slot.time_slots.length > 0) // Only slots with time
        .map(slot => ({
          date: slot.date,
          time: slot.time_slots.map(timeSlot => `${timeSlot.from_time} - ${timeSlot.to_time}`).join(', '),
          time_slot_ids: slot.time_slots.map(timeSlot => timeSlot.time_slot_id) // Store time_slot_ids
        }));

      setFormattedPickupTimes(formattedTimes);

    } catch (error) {
      console.error('Error fetching pickup slots:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getPickupTime();
  }, [courierId]);

  const handleSchedule = async () => {
    const pickupData = {
      courier_service_id: courierId,
      time_slot_id: pickupSlotId,
      selected_date: pickupDate,
      easyship_shipment_ids: [easyshipShipmentId]
    };

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
          <FormControl isRequired mt={4}>
            <FormLabel>Pick up Time:</FormLabel>
            <select
              id="pickupTime"
              value={pickupTime}
              onChange={(e) => {
                const selectedTime = e.target.value;
                setPickupTime(selectedTime);

                // Set pickupSlotId when time is selected
                const [date, time] = selectedTime.split(": ");
                const selectedSlot = formattedPickupTimes.find(slot => slot.date === date);
                const selectedTimeSlotId = selectedSlot?.time_slot_ids.find((id, idx) => {
                  return `${date}: ${selectedSlot.time.split(', ')[idx]}` === selectedTime;
                });
                setPickupSlotId(selectedTimeSlotId);
                setPickupDate(date);
              }}
            >
              <option value="">Select a time</option>
              {formattedPickupTimes.map((slot, index) => (
                <optgroup key={index} label={slot.date}>
                  {slot.time.split(', ').map((time, idx) => (
                    <option key={idx} value={`${slot.date}: ${time}`}> {/* Set the full formatted value */}
                      {`${slot.date}: ${time}`}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
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

