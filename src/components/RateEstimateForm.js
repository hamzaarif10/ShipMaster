import React, { useState } from 'react';
import RateEstimate from './RateEstimate';
import "../styles/RateEstimateForm.css";
import getRegionFromPostalCode from '../functions/fetchRegion';

function RateEstimateForm() {
    const [senderPostalCode, setSenderPostalCode] = useState("");
    const [senderCountryCode, setSenderCountryCode] = useState("");
    const [receiverPostalCode, setReceiverPostalCode] = useState("");
    const [receiverCountryCode, setReceiverCountryCode] = useState("");
    const [weight, setWeight] = useState(0);
    const [dimensions, setDimensions] = useState({ length: 0, width: 0, depth: 0 });
    const [rateEstimateComponent, setRateEstimateComponent] = useState(null); // To hold the component

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        //Fetch the province / state of the given postal code and country
        const senderRegion = await getRegionFromPostalCode(senderPostalCode, senderCountryCode);
        const receiverRegion = await getRegionFromPostalCode(receiverPostalCode, receiverCountryCode);

        // Dynamically create the RateEstimate component
        try {
            setRateEstimateComponent(
                React.createElement(RateEstimate, {
                    senderPostalCode,
                    senderProvince: senderRegion,
                    senderCountry: senderCountryCode,
                    receiverPostalCode,
                    receiverProvince: receiverRegion,
                    receiverCountry: receiverCountryCode,
                    weight,
                    dimensions
                })
            );
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
        }
    };

    return (
        <div className="shipping-form-container">
            <h2 className="form-title">Shipping Rate Calculator</h2>
            <form onSubmit={handleSubmit} className="shipping-form">
                {/* Sender and Receiver Info */}
                <div className="sender-receiver-container">
                    <div className="sender-info">
                        <h3>Sender Information</h3>
                        <div className="input-group">
                            <label htmlFor="senderPostalCode">Sender Postal Code</label>
                            <input
                                type="text"
                                id="senderPostalCode"
                                value={senderPostalCode}
                                onChange={(e) => setSenderPostalCode(e.target.value)}
                                placeholder="Enter sender's postal code"
                            />
                        </div>
                        <div className="input-group">
                                <label htmlFor="senderCountryCode">Country</label>
                                <select
                                    id="senderCountryCode"
                                    value={senderCountryCode}
                                    onChange={(e) => setSenderCountryCode(e.target.value)}
                                >
                                    <option value="" disabled>Select a Country Code</option>
                                    <option value="US">United States (US)</option>
                                    <option value="CA">Canada (CA)</option>
                                    <option value="GB">United Kingdom (GB)</option>
                                    <option value="AU">Australia (AU)</option>
                                    <option value="NZ">New Zealand (NZ)</option>
                                    <option value="DE">Germany (DE)</option>
                                    <option value="FR">France (FR)</option>
                                    <option value="IT">Italy (IT)</option>
                                    <option value="ES">Spain (ES)</option>
                                    <option value="SE">Sweden (SE)</option>
                                    <option value="NO">Norway (NO)</option>
                                    <option value="DK">Denmark (DK)</option>
                                    <option value="FI">Finland (FI)</option>
                                    <option value="CH">Switzerland (CH)</option>
                                    <option value="JP">Japan (JP)</option>
                                    <option value="SG">Singapore (SG)</option>
                                    <option value="KR">South Korea (KR)</option>
                                    <option value="IE">Ireland (IE)</option>
                                    <option value="NL">Netherlands (NL)</option>
                                </select>
                            </div>
                        </div>

                    <div className="receiver-info">
                        <h3>Receiver Information</h3>
                        <div className="input-group">
                            <label htmlFor="receiverPostalCode">Receiver Postal Code</label>
                            <input
                                type="text"
                                id="receiverPostalCode"
                                value={receiverPostalCode}
                                onChange={(e) => setReceiverPostalCode(e.target.value)}
                                placeholder="Enter receiver's postal code"
                            />
                        </div>
                        <div className="input-group">
                                <label htmlFor="receiverCountryCode">Country</label>
                                <select
                                    id="receiverCountryCode"
                                    value={receiverCountryCode}
                                    onChange={(e) => setReceiverCountryCode(e.target.value)}
                                >
                                    <option value="" disabled>Select a Country Code</option>
                                    <option value="US">United States (US)</option>
                                    <option value="CA">Canada (CA)</option>
                                    <option value="GB">United Kingdom (GB)</option>
                                    <option value="AU">Australia (AU)</option>
                                    <option value="NZ">New Zealand (NZ)</option>
                                    <option value="DE">Germany (DE)</option>
                                    <option value="FR">France (FR)</option>
                                    <option value="IT">Italy (IT)</option>
                                    <option value="ES">Spain (ES)</option>
                                    <option value="SE">Sweden (SE)</option>
                                    <option value="NO">Norway (NO)</option>
                                    <option value="DK">Denmark (DK)</option>
                                    <option value="FI">Finland (FI)</option>
                                    <option value="CH">Switzerland (CH)</option>
                                    <option value="JP">Japan (JP)</option>
                                    <option value="SG">Singapore (SG)</option>
                                    <option value="KR">South Korea (KR)</option>
                                    <option value="IE">Ireland (IE)</option>
                                    <option value="NL">Netherlands (NL)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                {/* Weight and Dimensions Input */}
                <div className="input-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        placeholder="Enter weight in kg"
                    />
                </div>

                <div className="input-group">
                    <label>Dimensions (cm)</label>
                    <div className="dimensions-inputs">
                        <input
                            type="number"
                            placeholder="Length"
                            value={dimensions.length}
                            onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                        />
                        <input
                            type="number"
                            placeholder="Width"
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                        />
                        <input
                            type="number"
                            placeholder="Height"
                            value={dimensions.depth}
                            onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn">Get Rate</button>
            </form>
            {rateEstimateComponent}
        </div>
    );
}

export default RateEstimateForm;


