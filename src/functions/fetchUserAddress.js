import axios from 'axios';
export async function fetchUserAddress({setUserAddressDetails, setSenderAddressLine1, setSenderProvince,
    setSenderCity, setSenderPostalCode, setSenderCompanyName, setSenderContactName, setSenderPhone, setSenderEmail}) 
{
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:3001/user/getUserAddress", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const newAddress = response.data.userAddressDetails;

      setUserAddressDetails(newAddress);
      setSenderAddressLine1(newAddress.userAddress);
      setSenderProvince(newAddress.userProvince);
      setSenderCity(newAddress.userCity);
      setSenderPostalCode(newAddress.userPostalCode);
      setSenderCompanyName(newAddress.userCompanyName);
      setSenderContactName(newAddress.userCompanyName);
      setSenderPhone(newAddress.userPhone);
      setSenderEmail(newAddress.email);
      
    } catch (error) {
      console.error("Error fetching user address:", error);
    }
  }