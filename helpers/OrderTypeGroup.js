const OrderTypeGroup = {
  STORE: 1,
  DELIVERY: 2,
  ONLINE: 3,
  STORE_TEXT: "Store",
  DELIVERY_TEXT: "Delivery",
  ONLINE_TEXT: "Online",
  ENABLE_CUSTOMER_SELECTION: 1,
  DISABLE_CUSTOMER_SELECTION: 0,
  ENABLE_STORE_ORDER: 1,
  DISABLE_STORE_ORDER: 0,
  ENABLE_DELIVERY_ORDER: 1,
  DISABLE_DELIVERY_ORDER: 0,
};

const orderTypeGroupOptions = [
  {
    label: OrderTypeGroup.STORE_TEXT,
    value: OrderTypeGroup.STORE,
  },
  {
    label: OrderTypeGroup.DELIVERY_TEXT,
    value: OrderTypeGroup.DELIVERY,
  },
  {
    label: OrderTypeGroup.ONLINE_TEXT,
    value: OrderTypeGroup.ONLINE,
  },
];

module.exports = {
  orderTypeGroupOptions,
  OrderTypeGroup,

};
