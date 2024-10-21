const orderService = require("../../services/OrderService");

const Permission = require("../../helpers/Permission");
const Order = require("../../helpers/Order");
const {
  getSettingList,
  getValueByObject,
  saveSetting,
} = require("../../services/SettingService");
const AttendanceService = require("../../services/AttendanceService");
const Request = require("../../lib/request");
const Number = require("../../lib/Number");
const StatusService = require("../../services/StatusService");
const Setting = require("../../helpers/Setting");
const ObjectName = require("../../helpers/ObjectName");
const Currency = require("../../lib/currency");
const { Location, account,order: orderModel } = require("../../db").models;
const PhoneNumber = require("../../lib/PhoneNumber");
const LocationService = require("../../services/LocationService");
const Response = require("../../helpers/Response");
const { CATEGORY_CUSTOMER } = require("../../helpers/Account");
const Status = require("../../helpers/Status");
const history = require("../../services/HistoryService");
const OrderTypeService = require("../../services/OrderTypeService");
const AccountTypeService = require("../../services/AccountTypeService");
const UserService = require("../../services/UserService");
const SlackService = require("../../services/SlackService");
const DateTime = require("../../lib/dateTime");
const { OrderTypeGroup } = require("../../helpers/OrderTypeGroup");
async function create(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);
    const timeZone = Request.getTimeZone(req);
   let locationId = Request.getCurrentLocationId(req)
    if (!companyId) {
      return res.json(Response.BAD_REQUEST, { message: "Company Not Found" });
    }

    let rolePermission = Request.getRolePermission(req);

    // order add permission check
    const hasPermission = await Permission.GetValueByName(Permission.ORDER_ADD, rolePermission);





    let currendtShiftId = Request.getCurrentShiftId(req);

    const body = req.body;
    const userId = Request.getUserId(req);

    let attendance,
      nextLocationOrderNumber,
      formatedNextOrderNumber,
      nextCompanyOrderNumber;

    attendance = await AttendanceService.getCurrentAttendance(
      userId,
      new Date(),
      companyId
    );
    let storeId = locationId ? Number.Get(locationId) :body?.storeId ?Number.Get(body?.storeId): null;

    let salesExecutiveId = body?.sales_executive_user_id
    ? Number.Get(body.sales_executive_user_id):body.owner
      ? Number.Get(body.owner)
      : attendance
      ? attendance.user_id
      : userId;

    let settingData = await getSettingList(companyId);

    let settingList = [];

    for (let i = 0; i < settingData.length; i++) {
      settingList.push(settingData[i]);
    }

    let orderNumberGeneration = await getValueByObject(
      Setting.SETTING_ORDER_NUMBER_GENERATION,
      settingList
    );
    if (
      orderNumberGeneration &&
      orderNumberGeneration === Order.ORDER_NUMBER_GENERATION_TYPE_LOCATION_WISE
    ) {
      let storeDetail;

      if (storeId) {
        storeDetail = await Location.findOne({
          where: { company_id: companyId, id: storeId },
        });
      }

      let lastOrderNumber = storeDetail && storeDetail.get("last_order_number");

      nextLocationOrderNumber =
        lastOrderNumber && lastOrderNumber !== ""
          ? parseInt(lastOrderNumber)
          : 0;

      nextLocationOrderNumber += 1;

      if (storeDetail?.location_code != null) {
        formatedNextOrderNumber = `${storeDetail?.location_code}-${nextLocationOrderNumber}`;
      } else {
        formatedNextOrderNumber = `${nextLocationOrderNumber}`;
      }
    } else {
      let lastOrderNumber = await getValueByObject(
        Setting.SETTING_LAST_ORDER_NUMBER,
        settingList
      );

      let orderCode = await getValueByObject(Setting.ORDER_CODE, settingList);

      nextCompanyOrderNumber =
        lastOrderNumber && lastOrderNumber !== ""
          ? parseInt(lastOrderNumber)
          : 0;

      nextCompanyOrderNumber += 1;
      if (orderCode != "") {
        formatedNextOrderNumber = `${orderCode}-${nextCompanyOrderNumber}`;
      } else {
        formatedNextOrderNumber = `${nextCompanyOrderNumber}`;
      }
    }


    let accountData
    let accountExist
   
    if(Number.isNotNull(body.mobile)){
      let type
      if(Number.isNotNull(body?.accountType)){
        let params={
          category: body?.accountType,
          companyId: companyId
        }
        let typeIds = await AccountTypeService.getAccountTypeByCategory(params)
        type=typeIds[0]
      }
      accountExist = await account.findOne({
          where: {status:  Status.ACTIVE, company_id: companyId,mobile : body.mobile},
      });
       if(Number.isNull(accountExist) && !body.isCreateNewAccount){
        return res.json(Response.OK, {isCreateAccount : true });
      }else if(Number.isNotNull(body.mobile) && body.isCreateNewAccount){
        const createData = {
          name: body.mobile,
          status: Status.ACTIVE ? Status.ACTIVE : body.status,
          company_id: companyId,
          type: type && type,
          mobile: body.mobile,
      };
  
       accountData = await account.create(createData);
      }
    }
    let statusData =  await StatusService.getFirstStatusDetail(ObjectName.ORDER_TYPE, companyId,null,body?.type)
    const orderData = {
      store_id: storeId,
      date: new Date(),
      order_number: formatedNextOrderNumber,
      company_id: companyId,
      status:statusData && statusData?.id,
      owner: body?.owner?body?.owner:salesExecutiveId,
      payment_type: body?.payment_type,
      shift: Number.isNotNull(body?.shift) ? body?.shift : currendtShiftId,
      createdBy: Number.Get(userId),
      customer_phone_number:
        body &&
        body?.customer_phone_number &&
        PhoneNumber.Get(body?.customer_phone_number),
        type: body?.type ? body?.type : null ,
        customer_account: Number.isNotNull(body?.customer_account) ? body?.customer_account :Number.isNotNull(accountExist) ?  accountExist?.dataValues?.id : Number.isNotNull(accountData) ? accountData?.id: null,
      upi_amount: Currency.Get(body?.upi_amount),
      cash_amount: Currency.Get(body?.cash_amount),
    };
    
    let getOrderTypeDetail = await OrderTypeService.get(orderData?.type, companyId);

    if(Number.isNotNull(getOrderTypeDetail) && Number.isNotNull(getOrderTypeDetail?.delivery_time) && getOrderTypeDetail?.allow_delivery == OrderTypeGroup.ENABLE_DELIVERY_ORDER && !DateTime.isValidDate(body?.delivery_date) ){
     orderData.delivery_date = DateTime.addDateTimeToGraceTime(orderData?.date, getOrderTypeDetail?.delivery_time, timeZone)
    }else{
      orderData.delivery_date = body?.delivery_date ? body?.delivery_date : null
    }

    const response = await orderService.create(orderData);

    if (Number.isNull(account)) { 
        await orderModel.update({customer_account:accountData?.id},{where:{id:response?.id}})
      }
    
    if (response) {
      if (
        orderNumberGeneration &&
        orderNumberGeneration ===
          Order.ORDER_NUMBER_GENERATION_TYPE_LOCATION_WISE &&
        storeId
      ) {
        await LocationService.updateLastOrderNumber(
          storeId,
          companyId,
          nextLocationOrderNumber
        );
      } else {
        saveSetting(
          Setting.SETTING_LAST_ORDER_NUMBER,
          nextCompanyOrderNumber,
          companyId,
          null,
          ObjectName.ORDER
        );
      }
    }
    //get order Id
    const orderId = response && response.dataValues && response.dataValues.id;

    res.json(Response.CREATE_SUCCESS, {
      message: "Order Added",
      orderId: orderId,
      orderDetail: response,
      account_id :  accountExist ?  accountExist.dataValues.id : accountData && accountData?.id
    });

    res.on("finish", async () => {
      //create a log for error
      history.create("Order Added", req, ObjectName.ORDER, orderId);

      if(statusData &&( statusData?.notify_to_owner == Status.NOTIFY_TO_OWNER_ENABLED)){

    const owner = response && response.dataValues && response.dataValues.owner;
    if(Number.isNotNull(owner)){
      const getSlackId = await UserService.getSlack(owner, companyId);

      if (getSlackId) {
        let userDefaultTimeZone =  Request.getTimeZone(req);

         let locationName =  await LocationService.getName(response.dataValues.store_id,companyId)

         let text = `<@${getSlackId?.slack_id}>  Order Added \n`;

         if (response?.dataValues?.order_number) {
          text += `Order Number: ${response?.dataValues?.order_number}\n`;
        }
         // Check if locationName exists before adding it to the text
         if (locationName) {
           text += `Location: ${locationName}\n`;
         }
         
         // Check if createdAt exists before adding the date to the text
         if (response?.dataValues?.createdAt) {
           text += `Date: ${DateTime.getDateTimeByUserProfileTimezone(response.dataValues.createdAt, userDefaultTimeZone)}\n`;
         }
         
         // Check if account exists before adding the date to the text

       if(Number.isNotNull(response?.dataValues?.customer_account)){

        let  accountData = await account.findOne({
          where: {company_id: companyId,id : response.dataValues.customer_account},
      });

         if (accountData?.name !== undefined && accountData?.name !== null) {
          text += `Customer: ${accountData?.name}\n`;
        }

      }
          SlackService.sendMessageToUser(companyId, getSlackId?.slack_id, text);

      }
    }
    }
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = create;