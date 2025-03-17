import React, { useState, useEffect } from 'react';
import RateEstimate from './RateEstimate';
import "../styles/RateEstimateForm.css";
import getRegionFromPostalCode from '../functions/fetchRegion';
import { Spinner } from '@chakra-ui/react';

function RateEstimateForm(props) {
    // Sender info
    const [senderPostalCode, setSenderPostalCode] = useState(props.senderPostalCode);
    const [senderCountryCode, setSenderCountryCode] = useState("");
    
    // Receiver info
    const receiverAddressLine1 = props.receiverAddressLine1 || "";
    const receiverCity = props.receiverCity || "";
    const receiverName = props.receiverName || "";
    const receiverPhoneNumber = props.receiverPhoneNumber || "";
    const receiverEmail = props.receiverEmail || "";
    const [receiverPostalCode, setReceiverPostalCode] = useState(props.receiverPostalCode);
    const [receiverCountryCode, setReceiverCountryCode] = useState("");
    
    // Parcel info
    const [weight, setWeight] = useState(0);
    const [dimensions, setDimensions] = useState({ length: 0, width: 0, depth: 0 });
    
    const [rateEstimateComponent, setRateEstimateComponent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('senderPostalCode:', props.senderPostalCode);
        console.log('receiverPostalCode:', props.receiverPostalCode);
    }, [props.senderPostalCode, props.receiverPostalCode]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const senderRegion = await getRegionFromPostalCode(senderPostalCode, senderCountryCode);
            const receiverRegion = await getRegionFromPostalCode(receiverPostalCode, receiverCountryCode);

           setRateEstimateComponent(
                <RateEstimate
                    senderPostalCode={senderPostalCode}
                    senderProvince={senderRegion}
                    senderCountry={senderCountryCode}
                    receiverAddressLine1={receiverAddressLine1}
                    receiverCity={receiverCity}
                    receiverPostalCode={receiverPostalCode}
                    receiverProvince={receiverRegion}
                    receiverCountry={receiverCountryCode}
                    receiverName={receiverName}
                    receiverPhoneNumber={receiverPhoneNumber}
                    receiverEmail={receiverEmail}
                    weight={weight}
                    dimensions={dimensions}
                />
            );
           
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="shipping-form-container">
            {/* Hide form after submission //!rateEstimateComponent && !loading && ( */}

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
                            <input type="number" placeholder="Length" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })} />
                            <input type="number" placeholder="Width" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })} />
                            <input type="number" placeholder="Height" value={dimensions.depth} onChange={(e) => setDimensions({ ...dimensions, depth: parseFloat(e.target.value) || 0 })} />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Get Rate</button>
                </form>
            

            {/* Show loading spinner */}
            {loading && <Spinner size="xl" color="teal.500" />}
            {rateEstimateComponent}
        </div>
    );
}

export default RateEstimateForm;



