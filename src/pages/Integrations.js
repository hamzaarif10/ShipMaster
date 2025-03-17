import { useState, useEffect } from "react";
import { 
  Box, Button, Text, VStack, Icon, Input, Modal, 
  ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, 
  ModalCloseButton, useDisclosure, Table, Thead, Tbody, Tr, Th, Td, Spinner 
} from "@chakra-ui/react";
import { FaShopify, FaEye, FaShippingFast } from "react-icons/fa";
import SideBar from "../components/SideBar.js";
import axios from 'axios';
import ShipShopifyOrderModal from "../modals/ShipShopifyOrderModal.js";

function Integrations() {
  const [shopifyDomain, setShopifyDomain] = useState('');
  const [isShopifyIntegrated, setIsShopifyIntegrated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { isOpen: isShopifyModalOpen, onOpen: onShopifyModalOpen, onClose: onShopifyModalClose } = useDisclosure();
  const { isOpen: isShipOrderModalOpen, onOpen: onShipOrderModalOpen, onClose: onShipOrderModalClose } = useDisclosure();

  useEffect(() => {
    async function getShopifyToken() {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get("http://localhost:3001/auth/get-shopify-auth-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.shopify_access_token) {
          setIsShopifyIntegrated(true);
          syncOrders();
        } else {
          setIsShopifyIntegrated(false);
        }
      } catch (error) {
        console.error("Error fetching Shopify token:", error);
      } finally {
        setLoading(false);
      }
    }
    getShopifyToken();
  }, []);

  async function handleConnectShopify(shopifyDomain) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/save-shopify-domain", 
        { shopifyDomain }, 
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const clientId = "3213dab65821e57efe779dbf6da6e612";
      const redirectUri = "https://f288-2001-4958-2fe0-c601-64bd-9d10-1fe4-35fb.ngrok-free.app/auth/callback";
      const oauthUrl = `https://${shopifyDomain}/admin/oauth/authorize?client_id=${clientId}&scope=read_orders,read_customers&redirect_uri=${redirectUri}`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Error connecting to Shopify:", error);
    }
  }

  const syncOrders = async () => {
    const token = localStorage.getItem("authToken");
    let shopifyDomain = "";
    let shopifyAccessToken = "";
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/auth/get-shopify-auth-details", {
        headers: { Authorization: `Bearer ${token}` }
      });
      shopifyDomain = response.data.shopify_domain;
      shopifyAccessToken = response.data.shopify_access_token;
    } catch (error) {
      console.error("Error retrieving Shopify domain name or access token:", error);
    }

    try {
      const response = await axios.get("http://localhost:3001/fetchShopifyOrders/orders/sync", {
        params: { shopifyDomain, shopifyAccessToken },
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error syncing orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = (order) => {
    setSelectedOrder(order);
    onShipOrderModalOpen();
  };

  return (
    <Box display="flex" minHeight="100vh" bgGradient="linear(to-br, teal.100, cyan.200)">
      {/* Sidebar */}
      <Box w={{ base: "80px", md: "250px" }} bg="gray.700" color="white" shadow="lg">
        <SideBar />
      </Box>

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        {loading ? (
          <VStack justify="center" align="center" height="100vh">
            <Spinner size="xl" color="teal.500" />
            <Text mt={4} color="gray.600">Checking Shopify integration...</Text>
          </VStack>
        ) : !isShopifyIntegrated ? (
          <VStack
            bg="white" 
            p={6} 
            borderRadius="lg" 
            shadow="xl" 
            spacing={4}
            maxW="400px"
            mx="auto"
            textAlign="center"
          >
            <Icon as={FaShopify} boxSize={12} color="green.500" />
            <Text fontSize="xl" fontWeight="bold" color="gray.700">Connect Your Shopify Store</Text>
            <Text fontSize="md" color="gray.600">
              Import your Shopify orders seamlessly and automate your shipping process.
            </Text>
            <Button colorScheme="green" size="lg" onClick={onShopifyModalOpen}>
              Connect Shopify
            </Button>
          </VStack>
        ) : (
          <Box>
            <Button colorScheme="green" size="md" mb={4} onClick={syncOrders} isLoading={loading}>
              Sync Orders
            </Button>

            {/* Orders Table */}
            {!loading && (
              <Table
                variant="striped" 
                colorScheme="teal" 
                size="md" 
                bg="white" 
                borderRadius="md" 
                shadow="md"
              >
                <Thead bg="teal.600">
                  <Tr>
                    <Th color="white" textAlign="center" fontSize="sm" fontWeight="bold" textTransform="uppercase" py={4}>
                      Name
                    </Th>
                    <Th color="white" textAlign="center" fontSize="sm" fontWeight="bold" textTransform="uppercase" py={4}>
                      Address
                    </Th>
                    <Th color="white" textAlign="center" fontSize="sm" fontWeight="bold" textTransform="uppercase" py={4}>
                      Phone
                    </Th>
                    <Th color="white" textAlign="center" fontSize="sm" fontWeight="bold" textTransform="uppercase" py={4}>
                      Email
                    </Th>
                    <Th color="white" textAlign="center" fontSize="sm" fontWeight="bold" textTransform="uppercase" py={4}>
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.map((order) => (
                    <Tr key={order.id} _hover={{ bg: "gray.100" }}>
                      <Td textAlign="center" fontSize="sm" fontWeight="medium" py={3}>
                        {`${order.customer.firstName} ${order.customer.lastName}`}
                      </Td>
                      <Td textAlign="center" fontSize="sm" py={3}>
                        {order.shippingAddress.address1}
                        {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}
                        <br />
                        {order.shippingAddress.country}
                      </Td>
                      <Td textAlign="center" fontSize="sm" py={3}>
                        {order.customer.phone || "N/A"}
                      </Td>
                      <Td textAlign="center" fontSize="sm" py={3}>
                        {order.customer.email || "N/A"}
                      </Td>
                      <Td textAlign="center" py={3}>
                        <Button
                          colorScheme="blue" 
                          size="lg" 
                          onClick={() => handleShipOrder(order)}
                          borderRadius="full"
                          _hover={{ bg: "blue.600", transform: "scale(1.05)" }}
                          leftIcon={<FaShippingFast />}
                        >
                          Ship
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
            {/* Ship Order Modal */}
            <ShipShopifyOrderModal 
              isOpen={isShipOrderModalOpen} 
              onClose={onShipOrderModalClose}
              order={selectedOrder}
            />
          </Box>
        )}
      </Box>

      {/* Modal for Shopify Domain Input */}
      <Modal isOpen={isShopifyModalOpen} onClose={onShopifyModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Your Shopify Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please enter your Shopify domain (e.g., `your-store-name.myshopify.com`):</Text>
            <Input
              value={shopifyDomain}
              onChange={(e) => setShopifyDomain(e.target.value)}
              placeholder="Enter Shopify domain"
              mb={4}
              borderRadius="md"
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="green"
              onClick={() => handleConnectShopify(shopifyDomain)}
              disabled={!shopifyDomain}
            >
              Connect Shopify
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Integrations;











