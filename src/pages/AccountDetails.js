import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar.js";
import {
  Box,
  Text,
  Heading,
  Stack,
  Center,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaPhone } from "react-icons/fa";
import axios from "axios";

function AccountDetails() {
  const [accountDetails, setAccountDetails] = useState(null);

  // Fetch account details from API
  async function fetchAccountDetails() {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        "http://localhost:3001/user/getAccountDetails",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAccountDetails(response.data.userAccountDetails);
    } catch (error) {
      console.error("Error fetching user account details:", error);
    }
  }

  // Fetch details on component mount
  useEffect(() => {
    fetchAccountDetails();
  }, []);

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Box w={{ base: "80px", md: "250px" }} bg="gray.700" color="white">
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box flex="1" bgGradient="linear(to-br, teal.50, blue.50)" p={6}>
        {/* Header */}
        <Center mb={6}>
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, teal.400, blue.400)"
            bgClip="text"
            textAlign="center"
          >
            Account Details
          </Heading>
        </Center>

        {/* Account Details */}
        {accountDetails ? (
          <Stack
            spacing={4}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            maxW="600px"
            mx="auto"
          >
            <Box display="flex" alignItems="center">
              <Icon as={FaUser} color="teal.500" mr={2} />
              <Text>
                <strong>First Name:</strong> {accountDetails.firstName}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaEnvelope} color="teal.500" mr={2} />
              <Text>
                <strong>Email:</strong> {accountDetails.email}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
              <Text>
                <strong>Address:</strong> {accountDetails.userAddress}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
              <Text>
                <strong>Province:</strong> {accountDetails.userProvince}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
              <Text>
                <strong>City:</strong> {accountDetails.userCity}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} color="teal.500" mr={2} />
              <Text>
                <strong>Postal Code:</strong> {accountDetails.userPostalCode}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaBuilding} color="teal.500" mr={2} />
              <Text>
                <strong>Company Name:</strong> {accountDetails.userCompanyName}
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaPhone} color="teal.500" mr={2} />
              <Text>
                <strong>Phone:</strong> {accountDetails.userPhone}
              </Text>
            </Box>
          </Stack>
        ) : (
          <Center mt={12}>
            <Spinner size="xl" color="teal.400" />
            <Text ml={4} fontSize="lg" fontWeight="semibold" color="teal.500">
              Loading account details...
            </Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default AccountDetails;

