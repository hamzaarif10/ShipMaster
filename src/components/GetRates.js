import React, { useEffect, useState } from 'react';
import '../styles/RenderRates.css';
import CreateShipmentForm from './CreateShipmentForm';

function GetRates({ senderCountryCode, receiverCountryCode, receiverPostalCode, dimensions, weight, glsRate, rate1, rate2, rate3, rate4, rate5, url1, url2, url3, url4, url5, courier1, courier2, courier3, courier4, courier5}) {
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedCourierUrl, setSelectedCourierUrl] = useState(null);
  const [selectedCourierCost, setSelectedCourierCost] = useState(null);

  const [allowedButtons, setAllowedButtons] = useState({
    gls: true,
    courier1: true,
    courier2: true,
    courier3: true,
    courier4: true,
    courier5: true
  });

  useEffect(() => {
    const currentUrl = window.location.href;
    if (!currentUrl.includes('create-shipment')) {
        setAllowedButtons({
          gls: false,
          courier1: false,
          courier2: false,
          courier3: false,
          courier4: false,
          courier5: false
        })
    }
  },[])

  const handleSelectRate = (courierId, courierUrl, courierCost) => {
    setSelectedCourier(courierId); // Update state to show the CreateShipmentForm
    setSelectedCourierUrl(courierUrl);
    setSelectedCourierCost(courierCost);
  };

  return (
    <div className='rates-container'>
      {selectedCourier ? (
        <CreateShipmentForm
          courierId={selectedCourier}
          courierUrl={selectedCourierUrl}
          courierCost={selectedCourierCost.toFixed(2)}
          senderCountry={senderCountryCode}
          receiverCountry={receiverCountryCode}
          receiverPostCode={receiverPostalCode}
          measurements={dimensions}
          mass={weight}
        />
      ) : (
        <>
          
          
            <div className="rate-tile">
              <img src={url1} alt="Easy ship Logo" className="gls-logo" />
              <div className="divider"></div>
              <p className="shipping-time">Shipping Time: 3-5 business days</p>
              <div className="divider"></div>
              <p className="rate-amount">Estimate: ${rate1.toFixed(2)}</p>
              {allowedButtons.courier1 && (
              <button
                onClick={() => handleSelectRate(courier1, url1, rate1)}
                type="button"
                className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                style={{ width: '179px' }}
              >
                Select Rate
              </button>)}
            </div>
            <div className="rate-tile">
              <img src={url2} alt="Easyship Logo" className="gls-logo" />
              <div className="divider"></div>
              <p className="shipping-time">Shipping Time: 3-5 business days</p>
              <div className="divider"></div>
              <p className="rate-amount">Estimate: ${rate2.toFixed(2)}</p>
              {allowedButtons.courier2 && (
              <button
                onClick={() => handleSelectRate(courier2, url2, rate2)}
                type="button"
                className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                style={{ width: '179px' }}
              >
                Select Rate
              </button>)}
            </div>
    
            <div className="rate-tile">
              <img src={url3} alt="Easyship Logo" className="gls-logo" />
              <div className="divider"></div>
              <p className="shipping-time">Shipping Time: 3-5 business days</p>
              <div className="divider"></div>
              <p className="rate-amount">Estimate: ${rate3.toFixed(2)}</p>
              {allowedButtons.courier3 && (
              <button
                onClick={() => handleSelectRate(courier3, url3, rate3)}
                type="button"
                className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                style={{ width: '179px' }}
              >
                Select Rate
              </button>)}
            </div>
            <div className="rate-tile">
              <img src={url4} alt="Easyship Logo" className="gls-logo" />
              <div className="divider"></div>
              <p className="shipping-time">Shipping Time: 3-5 business days</p>
              <div className="divider"></div>
              <p className="rate-amount">Estimate: ${rate4.toFixed(2)}</p>
              {allowedButtons.courier4 && (
              <button
                onClick={() => handleSelectRate(courier4, url4, rate4)}
                type="button"
                className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                style={{ width: '179px' }}
              >
                Select Rate
              </button>)}
            </div>
            <div className="rate-tile">
              <img src={url5} alt="Easyship Logo" className="gls-logo" />
              <div className="divider"></div>
              <p className="shipping-time">Shipping Time: 3-5 business days</p>
              <div className="divider"></div>
              <p className="rate-amount">Estimate: ${rate5.toFixed(2)}</p>
              {allowedButtons.courier5 && (
              <button
                onClick={() => handleSelectRate(courier5, url5, rate5)}
                type="button"
                className="btn btn-success btn-block btn-lg gradient-custom-4 text-body"
                style={{ width: '179px' }}
              >
                Select Rate
              </button>)}
            </div>
        </>
      )}
    </div>
  );
}

export default GetRates;

