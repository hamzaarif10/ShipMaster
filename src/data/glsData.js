export const getGlsCreateShipmentData = ({
    senderAddressLine1,
    senderProvince,
    senderCity,
    senderPostalCode,
    senderCompanyName,
    senderContactName,
    senderPhone,
    senderEmail,
    receiverAddressLine1,
    receiverProvince,
    receiverCity,
    receiverPostalCode,
    receiverContactName,
    receiverPhone,
    receiverEmail,
    receiverCountryCode,
    dimensions,
    weight
  }) => ({
    "deliveryType": "GRD",
    "category": "Parcel",
    "paymentType": "Prepaid",
    "billingAccount": "575623",
    "sender": {
      "addressLine1": senderAddressLine1,
      "addressLine2": "",
      "city": senderCity,
      "provinceCode": senderProvince,
      "postalCode": senderPostalCode,
      "countryCode": "CA",
      "customerName": senderCompanyName,
      "contact": {
        "fullName": senderContactName,
        "language": "en",
        "email": senderEmail,
        "department": "",
        "telephone": senderPhone,
        "extension": "1"
      }
    },
    "consignee": {
      "addressLine1": receiverAddressLine1,
      "addressLine2": "",
      "suite": "",
      "city": receiverCity,
      "provinceCode": receiverProvince,
      "postalCode": receiverPostalCode,
      "countryCode": receiverCountryCode,
      "customerName": receiverContactName,
      "contact": {
        "fullName": receiverContactName,
        "language": "en",
        "email": receiverEmail,
        "department": "",
        "telephone": receiverPhone,
        "extension": "1"
      }
    },
    "unitOfMeasurement": "KC",
    "parcels": [
      {
        "parcelType": "Box",
        "quantity": "1",
        "weight": weight,
        "length": dimensions.length,
        "depth": dimensions.depth,
        "width": dimensions.width,
        "status": 0,
        "groupId": 0,
        "requestReturnLabel": false
      }
    ]
  });