import React, { useState, useEffect } from 'react';
import GetRates from './GetRates';
import axios from 'axios';
import { calculateRateWithMargin } from '../functions/calculateRate';
import getProvinceCode from "../functions/getProvinceCode";

function RateEstimate({
  senderPostalCode,
  senderProvince,
  senderCountry,
  receiverAddressLine1,
  receiverCity,
  receiverPostalCode,
  receiverProvince,
  receiverCountry,
  receiverName,
  receiverPhoneNumber,
  receiverEmail,
  weight,
  dimensions
}) {
  const [rate1, setRate1] = useState('');
  const [rate2, setRate2] = useState('');
  const [rate3, setRate3] = useState('');
  const [rate4, setRate4] = useState('');
  const [rate5, setRate5] = useState('');
  const [rate6, setRate6] = useState('');
  const [courier1, setCourier1] = useState('');
  const [courier2, setCourier2] = useState('');
  const [courier3, setCourier3] = useState('');
  const [courier4, setCourier4] = useState('');
  const [courier5, setCourier5] = useState('');
  const [courier6, setCourier6] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [url3, setUrl3] = useState('');
  const [url4, setUrl4] = useState('');
  const [url5, setUrl5] = useState('');
  const [url6, setUrl6] = useState('');

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
  //ICS data
  const glsData = {
    "fromAddress": {
      "addr1": "1500 Bank St.",
      "countryCode": "CA",
      "postalCode": senderPostalCode,
      "city": "null",
      "residential": true,
      "isSaturday": false,
      "isInside": false,
      "isTailGate": false,
      "isTradeShow": false,
      "isLimitedAccess": false,
      "isStopinOnly": false
    },
    "toAddress": {
      "addr1": "1500 Bank St.",
      "countryCode": "CA",
      "postalCode": receiverPostalCode,
      "city": "null",
      "residential": true,
      "isSaturday": false,
      "isInside": false,
      "isTailGate": false,
      "isTradeShow": false,
      "isLimitedAccess": false,
      "isStopinOnly": false
    },
    "packages": [
      {
        "packageType": "MyPackage",
        "weight": weight,
        "weightUnits": "Kgs",
        "length": dimensions.length,
        "width": dimensions.width,
        "height": dimensions.height,
        "dimUnits": "CM",
        "insurance": 0,
        "isAdditionalHandling": false,
        "signatureOptions": "None",
        "description": "Gift for darling",
        "temperatureProtection": false,
        "isDangerousGoods": false,
        "isNonStackable": false
      }
    ],
    "currencyCode": "CAD",
    "billingOptions": "Prepaid",
    "isDocumentsOnly": true
  }
  //Fetch Ics Rate
  const fetchGlsRate = async () => {
    try {
    const response = await axios.post('http://localhost:3001/api/get-gls-rate', glsData);
      
      // Ensure that the 'rates' array is not empty
      if (response.data.rates && response.data.rates.length > 0) {
        const firstRate = response.data.rates.find(rate => rate.selectedService === "GlsDicomExpressGround");
        if (firstRate){
           //Update the rates with calculated margins
           setRate1(calculateRateWithMargin(firstRate.total));  // Assuming 'total' is the correct value for your calculation
           setUrl1("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/GLS_Logo_2021.svg/640px-GLS_Logo_2021.svg.png");
           setCourier1(firstRate.selectedService);
        }
     } else {
       console.error('No rates available in the response');
      }
    } catch (error) {
      console.error('Error fetching GLS rate:', error);
    }
  }
  
  
  // Fetch EasyShip rates
  const fetchEasyShipRates = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/get-easyship-rate', easyShipData);
      if (response.data.rates && response.data.rates.length > 0) {
        const filteredRates = response.data.rates.filter(
          (rate) => rate.cost_rank >= 1 && rate.cost_rank <= 6
        );
      
        const sortedRates = filteredRates.sort((a, b) => a.cost_rank - b.cost_rank);
      
        // Update the rates with calculated margins
        //setRate1(calculateRateWithMargin(sortedRates[0].rates_in_origin_currency.total_charge));
        //setUrl1(sortedRates[0].courier_service.logo);
        //setCourier1(sortedRates[0].courier_service.id);

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

        setRate6(calculateRateWithMargin(sortedRates[5].rates_in_origin_currency.total_charge));
        setUrl6(sortedRates[5].courier_service.logo);
        setCourier6(sortedRates[5].courier_service.id);
      } 
    } catch (error) {
      console.error('Error fetching EasyShip rate:', error);
    } 
  };

  // Trigger rate fetching when dimensions or other relevant props change
    if (dimensions && dimensions.length && dimensions.width && dimensions.depth) {
      fetchEasyShipRates();
      fetchGlsRate();
    }

  return (
    <div id='rates-section'>
      {/* Render the GetRates component once the data is available */}
      {(rate1 || (rate2 && rate3 && rate4)) && (
        <GetRates
          senderCountryCode={senderCountry}
          receiverAddressLine1={receiverAddressLine1}
          receiverCity = {receiverCity}
          receiverCountryCode={receiverCountry}
          receiverPostalCode={receiverPostalCode}
          receiverName={receiverName}
          receiverPhoneNumber={receiverPhoneNumber}
          receiverEmail={receiverEmail}
          dimensions={dimensions}
          weight={weight}
          rate1={rate1}
          rate2={rate2}
          rate3={rate3}
          rate4={rate4}
          rate5={rate5}
          rate6={rate6}
          url1={url1}
          url2={url2}
          url3={url3}
          url4={url4}
          url5={url5}
          url6={url6}
          courier1={courier1}
          courier2={courier2}
          courier3={courier3}
          courier4={courier4}
          courier5={courier5}
          courier6={courier6}
        />
      )}
    </div>
  );
}

export default RateEstimate;




