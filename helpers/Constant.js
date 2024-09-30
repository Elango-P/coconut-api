
const Order = require("./Order");

const orderPaymentTypeOptions = [
    {
      label: Order.PAYMENT_TYPE_CASH_TEXT,
      value: Order.PAYMENT_TYPE_CASH_VALUE,
    },
    {
      label: Order.PAYMENT_TYPE_UPI_TEXT,
      value: Order.PAYMENT_TYPE_UPI_VALUE,
    },
    {
      label: Order.PAYMENT_TYPE_MIXED_TEXT,
       value: Order.PAYMENT_TYPE_MIXED_VALUE,
    },
  ];
  module.exports ={
    orderPaymentTypeOptions
}