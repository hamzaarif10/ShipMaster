export const calculateRateWithMargin = (baseCharge) => {
    let margin = 0;
    const stripeFee = (baseCharge + margin) * 0.029 + 0.30; // Stripe fee calculation
    return baseCharge + margin + stripeFee; // Add profit margin and Stripe fees
  };