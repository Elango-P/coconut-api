

const Order = {
   STATUS_DRAFT : "Draft",
   STATUS_COMPLETED : "Completed" ,
   STATUS_CANCELLED : "Cancelled" ,
   PAYMENT_TYPE_MIXED_VALUE:3,
   PAYMENT_TYPE_UPI_VALUE:2,
   PAYMENT_TYPE_CASH_VALUE:1,
   PAYMENT_TYPE_UPI_TEXT:"Upi",
   PAYMENT_TYPE_CASH_TEXT:"Cash",
   PAYMENT_TYPE_MIXED_TEXT:'Mixed',
   DEFAULT_STOCK_QUANTITY:1,
   STORE_PRODUCT_MAX_QUANTITY_ORDER_DAYS :10,
   STORE_PRODUCT_MIN_QUANTITY_ORDER_DAYS :5,
   TYPE_STORE:1,
   TYPE_DELIVERY:2,
   TYPE_CREDIT:3,
   TYPE_CREDIT_TEXT:"Credit",
   TYPE_STORE_TEXT : "Store",
   TYPE_DELIVERY_TEXT:"Delivery",
   ORDER_NUMBER_GENERATION_TYPE_LOCATION_WISE:"Location Wise",
   TYPE_ONLINE:4,
   TYPE_ONLINE_TEXT : "Online",
   UPI_PAYMENT_VERIFIED: 1,
   UPI_PAYMENT_NOT_VERIFIED: 0,
   VERIFIED_UPI_PAYMENT_COMPANY_NAME: "THIDIFF RETAIL"
}

module.exports = Order;