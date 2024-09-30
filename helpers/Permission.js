const Request = require("../lib/request");
const {
  userRolePermissionService,
  isPermissionExist,
} = require("../services/UserRolePermissionService");

class Permission {
  // Company Permissions
  static COMPANY_VIEW = "company_view";
  static COMPANY_ADD = "company_add";
  static COMPANY_EDIT = "company_edit";
  static COMPANY_DELETE = "company_delete";
  static COMPANY_STATUS_UPDATE = "company_status_edit";


  static ACCOUNT_VIEW = "account_view";
  static ACCOUNT_EDIT = "account_edit";
  static ACCOUNT_ADD = "account_add";
  static ACCOUNT_DELETE = "account_delete"

  // Portal Permissions
  static PORTAL_VIEW = "portal_view";
  static PORTAL_ADD = "portal_add";
  static PORTAL_EDIT = "portal_edit";
  static PORTAL_DELETE = "potal_delete";

  // User Permissions
  static USER_VIEW = "user_view";
  static USER_ADD = "user_add";
  static USER_EDIT = "user_edit";
  static USER_DELETE = "user_delete";
  static USER_MANAGE_OTHERS = "user_manage_others";

  // Account Permissions
  static PAYMENT_ACCOUNT_VIEW = "payment_account_view";
  static PAYMENT_ACCOUNT_ADD = "payment_account_add";
  static PAYMENT_ACCOUNT_EDIT = "payment_account_edit";
  static PAYMENT_ACCOUNT_DELETE = "payment_account_delete";

  // Account Category Permissions
  static ACCOUNT_CATEGORY_VIEW = "account_category_view";
  static ACCOUNT_CATEGORY_ADD = "account_category_add";
  static ACCOUNT_CATEGORY_EDIT = "account_category_edit";
  static ACCOUNT_CATEGORY_DELETE = "account_category_delete";

  // Account Entry Permissions
  static ACCOUNT_ENTRY_VIEW = "account_entry_view";
  static ACCOUNT_ENTRY_ADD = "account_entry_add";
  static ACCOUNT_ENTRY_EDIT = "account_entry_edit";
  static ACCOUNT_ENTRY_DELETE = "account_entry_delete";

  // Activity Type Permissions
  static ACTIVITY_TYPE_VIEW = "activity_type_view";
  static ACTIVITY_TYPE_ADD = "activity_type_add";
  static ACTIVITY_TYPE_EDIT = "activity_type_edit";
  static ACTIVITY_TYPE_DELETE = "activity_type_delete";


  static ADMIN_ACTIVITY_TYPE_VIEW = "admin_activity_type_view";
  static ADMIN_ACTIVITY_TYPE_ADD = "admin_activity_type_add";
  static ADMIN_ACTIVITY_TYPE_EDIT = "admin_activity_type_edit";
  static ADMIN_ACTIVITY_TYPE_DELETE = "admin_activity_type_delete";

  static ACTIVITY_VIEW = "activity_view";
  static ACTIVITY_ADD = "activity_add";
  static ACTIVITY_EDIT = "activity_edit";
  static ACTIVITY_DELETE = "activity_delete";
  static ACTIVITY_MANAGE_OTHERS = "activity_manage_others";


  // Admin User Permissions
  static ADMIN_USER_VIEW = "admin_user_view";
  static ADMIN_USER_ADD = "admin_user_add";
  static ADMIN_USER_EDIT = "admin_user_edit";
  static ADMIN_USER_DELETE = "admin_user_delete";

  // Apartment Permissions
  static APARTMENT_VIEW = "apartment_view";
  static APARTMENT_ADD = "apartment_add";
  static APARTMENT_EDIT = "apartment_edit";
  static APARTMENT_DELETE = "apartment_delete";

  // Api Test Permissions
  static API_TEST_VIEW = "api_test_view";
  static API_TEST_ADD = "api_test_add";
  static API_TEST_EDIT = "api_test_edit";
  static API_TEST_DELETE = "api_test_delete";

  // Attendance Permissions
  static ATTENDANCE_VIEW = "attendance_view";
  static ATTENDANCE_ADD = "attendance_add";
  static ATTENDANCE_EDIT = "attendance_edit";
  static ATTENDANCE_DELETE = "attendance_delete";
  static ATTENDANCE_MANAGE_OTHERS = "attendance_manage_others";
  static USER_WEB_CHECKIN = "user_web_checkin"
  static USER_MOBILE_CHECKIN = "user_mobile_checkin"

  static BANK_SETTLEMENT_VIEW = "bank_settlement_view";
  static BANK_SETTLEMENT_ADD = "bank_settlement_add";
  static BANK_SETTLEMENT_EDIT = "bank_settlement_edit";
  static BANK_SETTLEMENT_DELETE = "bank_settlement_delete";
  

  // Bill Permissions
  static PURCHASE_VIEW = "purchase_view";
  static PURCHASE_ADD = "purchase_add";
  static PURCHASE_EDIT = "purchase_edit";
  static PURCHASE_DELETE = "purchase_delete";
  static PURCHASE_MANAGE_OTHERS = "purchase_manage_others";

  // Payment Permissions
  static PAYMENT_ADD = "payment_add";
  static PAYMENT_EDIT = "payment_edit";
  static PAYMENT_DELETE = "payment_delete";
  static PAYMENT_MANAGE_OTHERS = "payment_manage_others";

  static PURCHASE_ORDER_VIEW = "purchase_order_view";
  static PURCHASE_ORDER_ADD = "purchase_order_add";
  static PURCHASE_ORDER_EDIT = "purchase_order_edit";
  static PURCHASE_ORDER_DELETE = "purchase_order_delete";
  static PURCHASE_ORDER_STATUS_UPDATE = "purchase_order_status_update";
  // Candidate Message Permissions
  static CANDIDATE_MESSAGE_VIEW = "candidate_message_view";
  static CANDIDATE_MESSAGE_ADD = "candidate_message_add";
  static CANDIDATE_MESSAGE_EDIT = "candidate_message_edit";
  static CANDIDATE_MESSAGE_DELETE = "candidate_message_delete";

  // Candidate Profile Permissions
  static CANDIDATE_VIEW = "candidate_view";
  static CANDIDATE_ADD = "candidate_add";
  static CANDIDATE_EDIT = "candidate_edit";
  static CANDIDATE_DELETE = "candidate_delete";

  // Category Permissions
  static CATEGORY_VIEW = "category_view";
  static CATEGORY_ADD = "category_add";
  static CATEGORY_EDIT = "category_edit";
  static CATEGORY_DELETE = "category_delete";

  // Company User Permissions
  static COMPANY_USER_VIEW = "company_user_view";
  static COMPANY_USER_ADD = "company_user_add";
  static COMPANY_USER_EDIT = "company_user_edit";
  static COMPANY_USER_DELETE = "company_user_delete";

  // Country Permissions
  static COUNTRY_VIEW = "country_view";
  static COUNTRY_ADD = "country_add";
  static COUNTRY_EDIT = "country_edit";
  static COUNTRY_DELETE = "country_delete";

  static DEVICE_INFO_STATUS_UPDATE = "device_info_status_update"


  // Sales Permissions
  static SALE_SETTLEMENT_VIEW = "sale_settlement_view";
  static SALE_SETTLEMENT_ADD = "sale_settlement_add";
  static SALE_SETTLEMENT_EDIT = "sale_settlement_edit";
  static SALE_SETTLEMENT_DELETE = "sale_settlement_delete";
  static SALE_SETTLEMENT_STATUS_UPDATE = "sale_settlement_status_edit";
  static SALE_SETTLEMENT_MANAGE_OTHERS = "sale_settlement_manage_others";

  //Salary 
  static SALARY_ADD = "salary_add"
  static SALARY_EDIT = "salary_edit"
  static SALARY_VIEW = "salary_view"
  static SALARY_DELETE = "salary_delete"
  static SALARY_MANAGE_OTHERS = "salary_manage_others"

  // Store Permissions
  static LOCATION_VIEW = "location_view";
  static LOCATION_ADD = "location_add";
  static LOCATION_EDIT = "location_edit";
  static LOCATION_DELETE = "location_delete";
  static LOCATION_STATUS_UPDATE = "location_status_edit";
  static SALE_MANAGE_OTHERS = "sale_manage_others";

  // Bill Permission
  static PURCHASE_STATUS_UPDATE = "purchase_status_update";

  //Bill Permission
  static BILL_VIEW = "bill_view";
  static BILL_ADD = "bill_add";
  static BILL_EDIT = "bill_edit";
  static BILL_DELETE = "bill_delete";
  static BILL_MANAGE_OTHERS = "bill_manage_others";


  // Brand Permissions
  static BRAND_VIEW = "brand_view";
  static BRAND_ADD = "brand_add";
  static BRAND_EDIT = "brand_edit";
  static BRAND_DELETE = "brand_delete";
  static BRAND_STATUS_UPDATE = "brand_status_edit";

  // Product Category Permissions
  static PRODUCT_CATEGORY_VIEW = "product_category_view";
  static PRODUCT_CATEGORY_ADD = "product_category_add";
  static PRODUCT_CATEGORY_EDIT = "product_category_edit";
  static PRODUCT_CATEGORY_DELETE = "product_category_delete";
  static PRODUCT_CATEGORY_UPDATE = "product_category_update";

  // Product Permissions
  static PRODUCT_VIEW = "product_view";
  static PRODUCT_ADD = "product_add";
  static PRODUCT_EDIT = "product_edit";
  static PRODUCT_DELETE = "product_delete";
  static PRODUCT_UPDATE_STATUS = "product_update_status";
  static PRODUCT_BULK_UPDATE = "product_bulk_update";
  static PRODUCT_BULK_DELETE = "product_bulk_delete";
  static PRODUCT_SYNC = "product_sync";
  static SYNC_FROM_VENDOR_URL = "sync_from_vendor_url";
  static PRODUCT_PRICE_ADD = "product_price_add";

  // Tag Permissions
  static TAG_VIEW = "tag_view";
  static TAG_ADD = "tag_add";
  static TAG_EDIT = "tag_edit";
  static TAG_DELETE = "tag_delete";
  static TAG_STATUS_UPDATE = "tag_status_edit";

  // Inspection Permissions
  static INSPECTION_DELETE = "inspection_delete";

  // Customer Permissions

  static CUSTOMER_VIEW = "customer_view";
  static CUSTOMER_ADD = "customer_add";
  static CUSTOMER_EDIT = "customer_edit";
  static CUSTOMER_DELETE = "customer_delete";
  static CUSTOMER_IMPORT = "customer_import";
  static CUSTOMER_UPDATE_STATUS = "customer_update_status";

  // Inventory Permissions
  static INVENTORY_VIEW = "inventory_view";
  static INVENTORY_ADD = "inventory_add";
  static INVENTORY_EDIT = "inventory_edit";
  static INVENTORY_DELETE = "inventory_delete";

  // Order Product Permissions
  static ORDER_PRODUCT_VIEW = "order_product_view";
  static ORDER_PRODUCT_ADD = "order_product_add";
  static ORDER_PRODUCT_EDIT = "order_product_edit";
  static ORDER_PRODUCT_DELETE = "order_product_delete";
  static ORDER_PRODUCT_CANCEL = "order_product_cancel";
  static ORDER_PRODUCT_MANAGE_OTHERS = "order_product_manage_others";


  // Order Product Permissions
  static 
  ORDER_VIEW = "order_view";
  static ORDER_ADD = "order_add";
  static ORDER_EDIT = "order_edit";
  static ORDER_DELETE = "order_delete";
  static ORDER_IMPORT = "order_import";
  static ORDER_MANAGE_OTHERS = "order_manage_others";

  // Vendor Permissions
  static VENDOR_VIEW = "vendor_view";
  static VENDOR_ADD = "vendor_add";
  static VENDOR_EDIT = "vendor_edit";
  static VENDOR_DELETE = "vendor_delete";
  static VENDOR_STATUS_UPDATE = "vendor_status_edit";

  // Stock Entry
  static STOCK_ENTRY_VIEW = "stock_entry_view";
  static STOCK_ENTRY_ADD = "stock_entry_add";
  static STOCK_ENTRY_DELETE = "stock_entry_delete";
  static STOCK_ENTRY_STATUS_UPDATE = "stock_entry_status_update";
  static STOCK_ENTRY_MANAGE_OTHERS = "stock_entry_manage_others";

  // Stock Entry
  //  static TRANSFER_VIEW = "transfer_view";
  //  static TRANSFER_ADD = "transfer_add";
  //  static TRANSFER_DELETE = "transfer_delete";


  // Stock Product Entry
  static STOCK_PRODUCT_ENTRY_ADD = "stock_product_entry_Add";
  static STOCK_PRODUCT_ENTRY_VIEW = "stock_product_entry_view";
  static STOCK_PRODUCT_ENTRY_DELETE = "stock_product_entry_delete";

  // Vendor Product  Permissions
  static SUPPLIER_PRODUCT_BULK_DELETE = "supplier_product_bulk_delete";
  static SUPPLIER_PRODUCT_BULK_UPDATE_STATUS =
    "supplier_product_bulk_update_status";
  static SUPPLIER_PRODUCT_ADD = "supplier_product_add";
  static SUPPLIER_PRODUCT_DELETE = "supplier_product_delete";
  static SUPPLIER_PRODUCT_EXPORT_TO_PRODUCT =
    "supplier_product_export_to_product";
  static SUPPLIER_PRODUCT_IMPORT_VENDOR_PRODUCT =
    "supplier_product_import_vendor_product";
  static SUPPLIER_PRODUCT_VIEW = "supplier_product_view";
  static SUPPLIER_PRODUCT_SYNC_ALL_PRODUCTS =
    "supplier_product_sync_all_products";
  static SUPPLIER_PRODUCT_SYNC_PRODUCTS_FROM_VENDOR =
    "supplier_product_sync_products_from_vendor";
  static SUPPLIER_PRODUCT_EDIT = "supplier_product_edit";
  static SUPPLIER_PRODUCT_UPDATE_IMPORT_STATUS =
    "supplier_product_update_import_status";

  // Feature Permission
  static FEATURE_VIEW = "feature_view";
  static FEATURE_ADD = "feature_add";
  static FEATURE_SAVE = "feature_save";

  // Feature Permission
  static MEDIA_VIEW = "media_view";

  // Scheduler Jobs Permission
  static SCHEDULER_JOBS_VIEW = "scheduler_view";
  static SCHEDULER_JOBS_ADD = "scheduler_add";
  static SCHEDULER_JOBS_EDIT = "scheduler_edit";
  static SCHEDULER_JOBS_DELETE = "scheduler_delete";
  static SCHEDULER_JOBS_LAST_EXECUTED_UPDATE = "scheduler_last_executed_update";

  //System Settings
  static SYSTEM_SETTINGS_VIEW = "system_settings_view";
  static SYSTEM_SETTINGS_EDIT = "system_settings_edit";
  // System Logs Permission
  static HISTORY = "history";
  static STORE_PRODUCT_MEDIA_STATUS_UPDATE =
    "store_product_media_status_update";
  //fine permission
  static FINE_DELETE = "fine_delete";
  static FINE_ADD = "fine_add";
  static FINE_EDIT = "fine_edit";
  static FINE_VIEW = "fine_view";
  static FINE_STATUS_UPDATE = "fine_status_update";
  static FINE_MANAGE_OTHERS = "fine_manage_others"
  // Task View
  static TICKET_EDIT = "ticket_edit";

  //Account Entry
  static ACCOUNT_ENTRY_ADD = "account_entry_add";

  //labels 
  static PROJECT_LABEL_ADD = "project_label_add"
  static PROJECT_LABEL_EDIT = "project_label_edit"
  static PROJECT_LABEL_DELETE = "project_label_delete"

  //Project setting view

  static PROJECT_SETTING_VIEW = "project_setting_view"

  //Project setting Add
  static PROJECT_SETTING_ADD = "project_setting_add"

  //Project setting update
  static PROJECT_SETTING_EDIT = "project_setting_edit"

  //project setting type view
  static PROJECT_SETTING_TYPE_VIEW = "project_setting_TYPE_VIEW"

  //project config update
  static PROJECT_CONFIG_SAVE = "project_config_SAVE"

  //project priority view
  static PROJECT_PRIORITY_VIEW = "project_priority_view"
  static PROJECT_PRIORITY_ADD = "project_priority_add"
  static PROJECT_PRIORITY_DELETE = "project_priority_delete"


  //project severities view
  static PROJECT_SEVERITIES_VIEW = "project_severities_view"
  static PROJECT_SEVERITIES_ADD = "project_severities_add"
  static PROJECT_SEVERITIES_DELETE = "project_severities_delete"
  static PROJECT_SEVERITIES_EDIT = "project_severities_edit"

  //add ticket type
  static ADD_TICKET_TYPE = "add_ticket_type"

  //project_user_add
  static PROJECT_USER_ADD = "project_user_add"

  //project_user_list

  static PROJECT_USER_LIST = "project_user_list"
  static PROJECT_USER_DELETE = "project_user_delete"
  static PROJECT_USER_EDIT = "project_user_edit"

  // Transfer Permissions
  static TRANSFER_VIEW = "transfer_view";
  static TRANSFER_ADD = "transfer_add";
  static TRANSFER_EDIT = "transfer_edit";
  static TRANSFER_DELETE = "transfer_delete";
  static TRANSFER_STATUS = "transfer_status";
  static TRANSFER_MANAGE_OTHERS = "transfer_manage_others";



  // Transfer Product Permissions
  static TRANSFER_PRODUCT_ADD = "transfer_product_add";
  static TRANSFER_PRODUCT_EDIT = "transfer_product_edit";
  static TRANSFER_PRODUCT_DELETE = "transfer_product_delete";

  // Platform Permissions
  static PLATFORM_VIEW = "platform_view";
  static PLATFORM_ADD = "platform_add";
  static PLATFORM_EDIT = "platform_edit";
  static PLATFORM_DELETE = "platform_delete";

  // Ticket Permission
  static TICKET_DELETE = "ticket_delete";
  static TICKET_ADD = "ticket_add";
  static TICKET_EDIT = "ticket_edit";
  static TICKET_VIEW = "ticket_view";
  static TICKET_MANAGE_OTHERS = "ticket_manage_others";

  static SPRINT_ADD = "sprint_add";
  static SPRINT_VIEW = "sprint_view";
  static SPRINT_EDIT = "sprint_edit";
  static SPRINT_DELETE = "sprint_delete";


  // leads
  static LEADS_VIEW = "leads_view";
  static LEADS_ADD = "leads_add";
  static LEADS_EDIT = "leads_edit";
  static LEADS_DELETE = "leads_delete";
  static LEADS_MANAGE_OTHERS = "leads_manage_others";

  //reports
  static ORDER_PRODUCT_GRAPH_REPORTS_VIEW = "order_product_graph_report_view"
  static ORDER_PRODUCT_REPORT_VIEW = "order_product_report_view"
  static ORDER_REPORT_VIEW = "order_report_view"

  // Purchase reports
  static PURCHASE_REPORT_VENDOR_WISE_VIEW = "purchase_report_vendor_wise_view"
  static PURCHASE_RECOMMENDATION_REPORT_VIEW = "purchase_recommendation_report_view"

  // purchase product report

  static PURCHASE_PRODUCT_REPORT_VIEW = "purchase_product_report_view"

  // sales report
  static SALES_SETTLEMENT_REPORT_VIEW = "sales_settelement_report_view"

  //stock report
  static STOCK_REPORT_VIEW = "stock_report_view"
  static SALES_SETTLEMENT_DISCREPANCY_REPORT = "sales_settlement_discrepancy"
  static SALES_GST_REPORT_VIEW = "sales_gst_report_view"
  static PURCHASE_GST_REPORT_VIEW = "purchase_gst_report_view"
  static ORDER_CANCELLED_REPORT_VIEW = "order_cancelled_report_view"
  static ORDER_PRODUCT_CANCELLED_REPORT_VIEW = "order_product_cancelled_report_view"

  //store product report
  static STORE_PRODUCT_NO_ORDER_REPORT_VIEW = "store_product_no_order_report_view"
  static STORE_PRODUCT_NO_STOCK_REPORT_VIEW = "store_product_no_stock_report_view"
  static STORE_PRODUCT_STORE_PRODUCT_REPORT_VIEW = "store_product_stock_product_report_view"
  static STORE_PRODUCT_NEGATIVE_STOCK_REPORT_VIEW = "store_product_negative_stock_report_view"

  //transfer product
  static TRANSFER_PRODUCT_REPORT_VIEW = "transfer_product_report_view"

  static VISITOR_VIEW = "visitor_view";
  static VISITOR_ADD = "visitor_add";
  static VISITOR_EDIT = "visitor_edit";
  static VISITOR_DELETE = "visitor_delete";

  static REPLENISHMENT_ADD = "replenishment_add";
  static REPLENISHMENT_VIEW = "replenishment_view";
  static REPLENISHMENT_MANAGE_OTHERS = "replenishment_manage_others";

  //GatePass Permission 

  static GATE_PASS_VIEW = "gate_pass_view";
  static GATE_PASS_ADD = "gate_pass_add";
  static GATE_PASS_EDIT = "gate_pass_edit";
  static GATE_PASS_DELETE = "gate_pass_delete";

  // Task Permission
  static RECURRING_TASK_VIEW = "recurring_task_view";
  static RECURRING_TASK_ADD = "recurring_task_add";
  static RECURRING_TASK_EDIT = "recurring_task_edit";
  static RECURRING_TASK_DELETE = "recurring_task_delete";
  static RECURRING_TASK_MANAGE_OTHERS = "recurring_task_manage_others";

  //Timesheet Permision
  static TIMESHEET_VIEW = "timesheet_view";
  static TIMESHEET_ADD = "timesheet_add";
  static TIMESHEET_EDIT = "timesheet_edit";
  static TIMESHEET_DELETE = "timesheet_delete";
  static TIMESHEET_MANAGE_OTHERS = "timesheet_manage_others"

  static REPLENISHMENT_ALLOCATION_REPORT_VIEW = "replenishment_allocation_report_view"

  //Sales Coin
  static REWARD_VIEW = "reward_view"

  //Check User Permissions
  static async Has(name, req) {
    try {
      if (!name) {
        return null;
      }
      if (req.isSuperAdmin) {
        return true;
      }
      //Get Company Id
      const role_id = req.user.role;

      const company_id = Request.GetCompanyId(req);
      const isExist = await isPermissionExist(name, role_id, company_id);
      return isExist;
    } catch (err) {
      console.log(err);
    }
  }
  static async GetValueByName(name, list) {
   
    try {
      if (!name) {
        return null; 
      }
      for (const data of list) { 
        if (data.role_permission === name) {
          return true; 
        }
      }
      return false;
    } catch (err) {
      console.log(err); 
      return null; 
    }
  }
}

module.exports = Permission;
