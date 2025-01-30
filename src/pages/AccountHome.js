import RateEstimateForm from "../components/RateEstimateForm.js";
import SideBar from "../components/SideBar.js";
import { Box } from '@chakra-ui/react';
import UserAddressModal from "../modals/UserAddressModal.js";
import { useDisclosure } from '@chakra-ui/react'; 

function AccountHome() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box 
      display="flex" 
      minHeight="100vh" 
      bgGradient="linear(to-br, teal.100, cyan.200)" // Bluish-Turquoise Gradient for the Page Background
    >
      {/* Sidebar */}
      <Box 
        w={{ base: "80px", md: "250px" }} 
        bg="gray.700" 
        color="white" 
        shadow="lg"
      >
        <SideBar />
      </Box>
        <RateEstimateForm />
        <UserAddressModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
}

export default AccountHome;



