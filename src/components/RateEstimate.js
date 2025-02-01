import React, { useState, useEffect } from 'react';
import GetRates from './GetRates';
import axios from 'axios';
import { calculateRateWithMargin } from '../functions/calculateRate';

function RateEstimate({
  senderPostalCode,
  senderProvince,
  senderCountry,
  receiverPostalCode,
  receiverProvince,
  receiverCountry,
  weight,
  dimensions
}) {
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [rate4, setRate4] = useState('');
  const [rate5, setRate5] = useState('');
  const [courier1, setCourier1] = useState('');
  const [courier2, setCourier2] = useState('');
  const [courier3, setCourier3] = useState('');
  const [courier4, setCourier4] = useState('');
  const [courier5, setCourier5] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [url3, setUrl3] = useState('');
  const [url4, setUrl4] = useState('');
  const [url5, setUrl5] = useState('');

  const category = 'Parcel';
  const quantity = 1;
  const parcelType = "Box";
  // EasyShip rate estimate data
  const easyShipData = {
    origin_address: {
      state: senderProvince,
      city: "new",
      postal_code: senderPostalCode,
      country_alpha2: senderCountry
    },
    destination_address: {
      country_alpha2: receiverCountry,
      line_1: "new",
      state: receiverProvince,
      city: "new",
      postal_code: receiverPostalCode
    },
    incoterms: "DDU",
    courier_settings: {
      show_courier_logo_url: true
    },
    shipping_settings: {
      units: {
        weight: "kg",
        dimensions: "cm"
      },
      output_currency: "CAD"
    },
    parcels: [
      {
        box: {
          slug: null,
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.depth
        },
        items: [
          {
            contains_battery_pi966: false,
            contains_battery_pi967: false,
            contains_liquids: false,
            origin_country_alpha2: "CA",
            quantity: 1,
            declared_currency: "CAD",
            actual_weight: weight,
            declared_customs_value: 0.1,
            hs_code: "85171400"
          }
        ],
        total_actual_weight: weight
      }
    ]
  };
  // Fetch EasyShip rates
  const fetchEasyShipRates = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/get-easyship-rate', easyShipData);
      if (response.data.rates && response.data.rates.length > 0) {
        const filteredRates = response.data.rates.filter(
          (rate) => rate.cost_rank >= 1 && rate.cost_rank <= 5
        );
      
        const sortedRates = filteredRates.sort((a, b) => a.cost_rank - b.cost_rank);
      
        // Update the rates with calculated margins
        setRate1(calculateRateWithMargin(sortedRates[0].rates_in_origin_currency.total_charge));
        setUrl1(sortedRates[0].courier_service.logo);
        setCourier1(sortedRates[0].courier_service.id);
      
        setRate2(calculateRateWithMargin(sortedRates[1].rates_in_origin_currency.total_charge));
        setUrl2(sortedRates[1].courier_service.logo);
        setCourier2(sortedRates[1].courier_service.id);
      
        setRate3(calculateRateWithMargin(sortedRates[2].rates_in_origin_currency.total_charge));
        setUrl3(sortedRates[2].courier_service.logo);
        setCourier3(sortedRates[2].courier_service.id);
      
        setRate4(calculateRateWithMargin(sortedRates[3].rates_in_origin_currency.total_charge));
        setUrl4(sortedRates[3].courier_service.logo);
        setCourier4(sortedRates[3].courier_service.id);

        setRate5(calculateRateWithMargin(sortedRates[4].rates_in_origin_currency.total_charge));
        setUrl5(sortedRates[4].courier_service.logo);
        setCourier5(sortedRates[4].courier_service.id);
      } 
    } catch (error) {
      console.error('Error fetching EasyShip rate:', error);
    }
  };

  // Trigger rate fetching when dimensions or other relevant props change
    if (dimensions && dimensions.length && dimensions.width && dimensions.depth) {
      fetchEasyShipRates();
    }

  return (
    <div id='rates-section'>
      {/* Render the GetRates component once the data is available */}
      {rate1 && rate2 && rate3 && (
        <GetRates
          senderCountryCode={senderCountry}
          receiverCountryCode={receiverCountry}
          receiverPostalCode={receiverPostalCode}
          dimensions={dimensions}
          weight={weight}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          rate4={rate4}
          rate5={rate5}
          url1={url1}
          url2={url2}
          url3={url3}
          url4={url4}
          url5={url5}
          courier1={courier1}
          courier2={courier2}
          courier3={courier3}
          courier4={courier4}
          courier5={courier5}
        />
      )}
    </div>
  );
}

export default RateEstimate;




