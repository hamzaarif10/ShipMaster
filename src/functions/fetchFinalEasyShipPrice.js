import axios from "axios";
import { calculateRateWithMargin } from "./calculateRate";
export const fetchFinalPrice = async (courierIdToMatch, easyShipRateEstimateData, setPriceDetails, setIsLoading) => {
    try {
  
      const response = await axios.post(
        "http://localhost:3001/api/get-easyship-rate",
        easyShipRateEstimateData
      );
  
      if (response.data && response.data.rates) {
        const matchedRate = response.data.rates.find(
          rate => rate.courier_service.id === courierIdToMatch
        );
      setPriceDetails({
        newPrice:  calculateRateWithMargin(matchedRate.rates_in_origin_currency.total_charge).toFixed(2),
        newLogo: matchedRate.courier_service.logo
      })
      setIsLoading(false);
      } else {
        console.error("Invalid response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching shipment label:", error);
    }
  };