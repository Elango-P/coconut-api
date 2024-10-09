//Default Scheduler Job
module.exports = [
  {
    name: "Account Product: Update from Purchase Product",
    api_url: "/v1/scheduler/accountProduct/updateFromPurchaseProduct",
  },
  {
    name: "Attendance: Daily Report",
    api_url: "/v1/scheduler/attendance/dailyReport",
  },
  {
    name: "Attendance: Add Missing Records",
    api_url: "/v1/scheduler/attendance/addMissingRecords",
  },
  {
    name: "Attendance: Add Absent Record",
    api_url: "/v1/scheduler/attendance/autoAbsentAdd",
  },
  {
    name: "Attendance: Send Attendance Missing Report Email",
    api_url: "/v1/scheduler/attendance/sendAttendanceMissingReportEmail",
  },
  {
    name: "Attendance: Update Late Hours",
    api_url: "/v1/scheduler/attendance/updateAttendanceLateAndOvertimeHours",
  },
  {
    name: "Bill: Regenerate Bill Number",
    api_url: "/v1/scheduler/bill/regenerateBillNumber",
  },
  {
    name: "Setup: Create Default Records",
    api_url: "/v1/scheduler/setup/createDefaultRecords",
  },
  {
    name: "Media:  Update S3 ACH",
    api_url: "/v1/scheduler/media/updateACH",
  },
  {
    name: "Media: Update Media From Product Media Table ",
    api_url: "/v1/scheduler/media/productMediaToMediaMigration",
  },
  {
    name: "Notification: Location - Daily Order Report Email",
    api_url: "/v1/scheduler/reports/dailyOrderReportEmail",
  },
  {
    name: "Location: No Check-In Notification",
    api_url: "/v1/scheduler/location/noCheckInEmail",
  },
  {
    name: "Location: Opening Report",
    api_url: "/v1/scheduler/location/locationOpeningReport",
  },
  {
    name: "Notification: Location Product Shortage Quantity Report Email",
    api_url: "/v1/scheduler/locationProduct/shortageQuantityReportEmail",
  },
  {
    name: "Notification: Location Product Excess Quantity Report Email",
    api_url: "/v1/scheduler/locationProduct/excessQuantityReportEmail",
  },
  {
    name: "Location Product: Update Min/Max Order Quantity",
    api_url: "/v1/scheduler/locationProduct/updateMinMaxOrderQuantity",
  },
  {
    name: "Location Product: Add Missing Products",
    api_url: "/v1/scheduler/locationProduct/addMissingProducts",
  },
  {
    name: "Location Product:Reindex",
    api_url: "/v1/scheduler/locationProduct/reindex",
  },
  {
    name: "Notification:Cancelled orders",
    api_url: "/v1/scheduler/order/cancelledOrders",
  },
  {
    name: "Order Product: Top(50) Report",
    api_url: "/v1/scheduler/reports/orderProductTop50Report",
  },
  {
    name: "Order: Top (50) Report",
    api_url: "/v1/scheduler/order/orderTop50Report",
  },
  {
    name: "Product: Update Product Index",
    api_url: "/v1/scheduler/product/productIndex",
  },
  {
    name: "Product Index: Update Order Quantity",
    api_url: "/v1/scheduler/productIndex/updateOrderQuantity",
  },
  {
    name: "Product: Price Update",
    api_url: "/v1/scheduler/product/updatePrice",
  },
  {
    name: "Product: Update Product Id In Stock Entry Product Table",
    api_url: "/v1/scheduler/product/updateProductIdInStockEntryProduct",
  },
  {
    name: "Product: Update Product Id In Transfer Product Table",
    api_url: "/v1/scheduler/product/product/updateProductIdInTransferProduct",
  },
  {
    name: "Product:  Update Product Id In Bill Product Table",
    api_url: "/v1/scheduler/product/updateProductIdInBillProduct",
  },
  {
    name: "Update:Update Purchase Product StoreId",
    api_url: "/v1/scheduler/purchaseProduct/updatePurchaseProductStoreId",
  },
  {
    name: "Purchase Order: Create",
    api_url: "/v1/scheduler/purchseorder/purchaseOrderCreate",
  },
  {
    name: "Recurring Task: Create",
    api_url: "/v1/scheduler/recurringTask/recurringTaskCreate",
  },
  {
    label: "Recurring Task: Create Missing Tasks",
    value: "/v1/scheduler/recurringTask/createMissingRecurringTask"
  },
  {
    name: "Replenishment: Create",
    api_url: "/v1/scheduler/replenishment/create",
  },
  {
    name: "Replenishment: update",
    api_url: "/v1/scheduler/replenishment/update",
  },
  {
    name : "Transfer Product: Daily Expired Return Products Report",
    api_url : "/v1/scheduler/transferProduct/dailyExpiredReturnProductsReport"
  },
  {
    name: "Bills - Pending Report",
    api_url: "/v1/scheduler/reports/billPendingReport",
  },
  {
    name: "Order: No Order Report",
    api_url: "/v1/scheduler/reports/noOrderReport",
  },
  {
    name: "Notification:Summary Report",
    api_url: "/v1/scheduler/reports/summaryReport",
  },
  {
    name: "Purchase - Pending Report",
    api_url: "/v1/scheduler/reports/purchasePendingReport",
  },
  {
    name: "Payment - Pending Report",
    api_url: "/v1/scheduler/reports/paymentPendingReport",
  },
  {
    name: "Sale: Regenerate Sale Number",
    api_url: "/v1/scheduler/saleSettlement/regenerateSaleNumber",
  },
  {
    name: "Sales Settlement: Missing Report",
    api_url: "/v1/scheduler/saleSettlement/salesSettlementMisssingReport",
  },
   {
    name: "Sales Settlement: Update Order Amount",
    api_url: "/v1/scheduler/saleSettlement/updateOrderAmount",
  },
  {
    name: "Sales Settlement: Create Sales Settlement Missing Ticket",
    api_url: "/v1/scheduler/saleSettlement/createSaleSettlementMissingTicket",
  },
  {
    name: "Notification: Product Wise- Daily Sale Report Email",
    api_url: "/v1/scheduler/sale/dailyProductSaleReportEmail",
  },
  {
    name: "Sales: Daily Report",
    api_url: "/v1/scheduler/sales/salesReportMail",
  },
  {
    name: "Sale: Update SaleDiscrepancy",
    api_url: "/v1/scheduler/saleSettlement/saleDiscrepancyUpdate",
  },
  {
    name: "Notification: No Activity Reminder Slack Notification",
    api_url: "/v1/scheduler/slack/noActivityEmail",
  },
  {
    name: "Notification: Goal Status Reminder Slack Notification",
    api_url: "/v1/scheduler/slack/goalStatusEmail",
  },
  {
    name: "Stock Entry: Create Based on Location",
    api_url: "/v1/scheduler/stockEntry/stockEntryCreateBasedOnLocation",
  },
  {
    name: "Stock Entry Product:Update Status From Not Matched To Accepted",
    api_url: "/v1/scheduler/stockEntryProduct/UpdateStockEntryProductStatusFromNotMatchedToAccepted",
  },
  {
    name: "Stock Entry: Daily Report",
    api_url: "/v1/scheduler/stockEntry/stockEntryDailyReport",
  },
  {
    name: "Country: Sync Country Records",
    api_url: "/v1/scheduler/sync/country",
  },
  {
    name: "Product: Sync Vendor Product",
    api_url: "/v1/scheduler/sync/vendorProduct",
  },
  {
    name: "User: Sync Users From Tracker",
    api_url: "/v1/scheduler/sync/syncUsersFromTracker",
  },
  {
    name: "Attendance: Sync Attendance From Tracker",
    api_url: "/v1/scheduler/sync/syncAttendanceFromTracker",
  },
  {
    name: "Ticket: Update Ticket Index",
    api_url: "/v1/scheduler/ticket/ticketIndex",
  },
  {
    name: "Ticket: No inprogress tickets notification",
    api_url: "/v1/scheduler/ticket/noInprogressTicket",
  },
  {
    name: "Transfer: Create Return Transfer for Excess Quantity",
    api_url: "/v1/scheduler/transfer/returnTransferForExcessQuantity",
  },
  {
    name: "User: Auto-Lgout",
    api_url: "/v1/scheduler/user/userAutoLogout",
  },
  {
    label: "User: Incomplete Profile Report",
    value: "/v1/scheduler/user/userIncompleteProfileReportEmail"
  },
  {
    name: "User: No Check-In Report",
    api_url: "/v1/scheduler/user/noCheckinActivityReport",
  },
  {
    name: "User: Update User Role",
    api_url: "/v1/scheduler/user/userRole",
  },
  {
    name: "User: Add Monthly Leave Balance",
    api_url: "/v1/scheduler/user/userMonthlyLeaveBalanceAdd",
  },
  {
    name: "User: Reindex",
    api_url: "/v1/scheduler/user/reindex",
  },
  {
    name: "User: Update Start Date and End Date from Attendance",
    api_url: "/v1/scheduler/user/addUserStartdateAndEnddateFromAttendance",
  },
  {
    label: "User - Add Missing Profile Picture From Attendnace",
    value: "/v1/scheduler/user/addUserProfilePictureFromAttendance",
  },
  {
    name: "Location Product - Update Average Order Quantity",
    api_url: "/v1/scheduler/updateAverageOrderQuantity",
  },
  {
    name: "Location Product: Update Min/Max Order Quantity By Average Order Quantity",
    api_url: "/v1/scheduler/locationProduct/updateMinMaxOrderQuantityByAverageOrderQuantity",
  },
  {
    name: "Sale Settlemet - create missing fine",
    api_url: "/v1/scheduler/saleSettlement/createMissingFine",
  },
  {
    name: "Account : Create User Account",
    api_url: "/v1/scheduler/account/createUserAccount",
  },
  {
    name: "Category : Update Order Quantity",
    api_url: "/v1/scheduler/category/updateOrderQuantity",
  },
  {
    label: "Order: Delete zero orders",
    value: "/v1/scheduler/order/deleteZeroOrders",
  },
  {
    label: "Order Product: Cancelled Report",
    value: "/v1/scheduler/orderProduct/cancelledReport"
  },
];
