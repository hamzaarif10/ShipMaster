export const getEasyshipCreateShipmentData = ({
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
    weight,
    courierId,
  }) => ({
    origin_address: {
      line_1: senderAddressLine1,
      state: senderProvince,
      city: senderCity,
      postal_code: senderPostalCode,
      company_name: senderCompanyName,
      contact_name: senderContactName,
      contact_phone: senderPhone,
      contact_email: senderEmail,
    },
    destination_address: {
      line_1: receiverAddressLine1,
      state: receiverProvince,
      city: receiverCity,
      postal_code: receiverPostalCode,
      contact_name: receiverContactName,
      contact_phone: receiverPhone,
      contact_email: receiverEmail,
      country_alpha2: receiverCountryCode,
    },
    incoterms: "DDU",
    insurance: {
      is_insured: false,
    },
    courier_settings: {
      courier_service_id: courierId,
      allow_fallback: false,
      apply_shipping_rules: true,
    },
    shipping_settings: {
      additional_services: {
        qr_code: "none",
      },
      units: {
        weight: "kg",
        dimensions: "cm",
      },
      buy_label: false,
      buy_label_synchronous: false,
      printing_options: {
        format: "pdf",
        label: "4x6",
        commercial_invoice: "A4",
        packing_slip: "4x6",
      },
    },
    parcels: [
      {
        box: {
          length: dimensions.length,
          width: dimensions.width,
          height: dimensions.depth,
        },
        items: [
          {
            description: "na",
            quantity: 1,
            declared_currency: "CAD",
            declared_customs_value: 0.1,
            hs_code: "85171400",
          },
        ],
        total_actual_weight: weight,
      },
    ],
  });
  export const getEasyshipRateEstimateData = ({
    senderProvince,
    senderPostalCode,
    senderCountry,
    receiverProvince,
    receiverPostalCode,
    receiverCountry,
    dimensions,
    weight
  }) => ({
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
  });
  