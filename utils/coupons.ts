// coupons.ts
export const coupons = [
  {
    code: "SCALEUP40",
    discountType: "percentage",
    value: 40, // 40% discount
    appliesTo: "all", // "all" or specific plan IDs
  },
  {
    code: "FLAT50",
    discountType: "fixed",
    value: 50, // $50 or ₹50 discount
    appliesTo: "all",
  },
  {
    code: "TAILGRIDSNEW",
    discountType: "percentage",
    value: 10,
    appliesTo: "all",
  },
  // Add more coupons as needed
];

export const applyCoupon = (price: number, couponCode: string, currency: string) => {
  const coupon = coupons.find((c) => c.code === couponCode);

  if (!coupon) {
    return { discountedPrice: price, discountAmount: 0, isValid: false, message: "Invalid coupon code." };
  }

  let discountAmount = 0;
  let discountedPrice = price;

  if (coupon.discountType === "percentage") {
    discountAmount = (price * coupon.value) / 100;
    discountedPrice = price - discountAmount;
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.value;
    discountedPrice = price - discountAmount;
  }

  // Ensure price doesn't go below zero
  discountedPrice = Math.max(0, discountedPrice);

  return {
    discountedPrice: discountedPrice,
    discountAmount: discountAmount,
    isValid: true,
    message: "Coupon applied successfully!",
  };
};
