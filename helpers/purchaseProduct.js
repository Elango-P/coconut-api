const purchaseProduct = {
  MARGIN_STATUS_MATCHED_TEXT: "Matched",
  MARGIN_STATUS_NOT_MATCHED_TEXT: "Not Matched",
  MARGIN_STATUS_NOT_MATCHED_ACCEPTED_TEXT: "Not Matched(Accepted)",
  MARGIN_STATUS_MATCHED: 1,
  MARGIN_STATUS_NOT_MATCHED: 2,
  MARGIN_STATUS_NOT_MATCHED_ACCEPTED: 3,
};

const status = [
  {
    label: purchaseProduct.MARGIN_STATUS_MATCHED_TEXT,
    value: purchaseProduct.MARGIN_STATUS_MATCHED,
  },
  {
    label: purchaseProduct.MARGIN_STATUS_NOT_MATCHED_TEXT,
    value: purchaseProduct.MARGIN_STATUS_NOT_MATCHED,
  },
  {
    label: purchaseProduct.MARGIN_STATUS_NOT_MATCHED_ACCEPTED_TEXT,
    value: purchaseProduct.MARGIN_STATUS_NOT_MATCHED_ACCEPTED,
  },
];

module.exports = {
  purchaseProduct,
  status,
};
