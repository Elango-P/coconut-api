const {
  Attendance: AttendanceModel,
  SaleSettlement,
  status,
  TimeSheet,
  TimeSheetDetail,
  TicketIndex,
  FineBonus,
  order,
  Bill,
  Payment,
  Transfer,
  Purchase,
  Location: LocationModel,
  Shift,
  Activity
} = require("../db").models;

const { getSettingValueByObject, getSettingList, getSettingValue } = require("../services/SettingService");

const ObjectName = require("../helpers/ObjectName");

const Setting = require("../helpers/Setting");

const { Op, where } = require("sequelize");

const DataBaseService = require("../lib/dataBaseService");

const statusService = new DataBaseService(status);

const DateTime = require("../lib/dateTime");


const Number = require("../lib/Number");

const Time = require("../lib/time");

const Status = require("../helpers/Status");

const StatusService = require("../services/StatusService");

const UserService = require("../services/UserService");

const errors = require("restify-errors");
const Location = require("../helpers/Location");
const TransferProductReportService = require("./TransferProductReportService");
const Attendance = require("../helpers/Attendance");
const AttendanceService = require("./AttendanceService");
const ShiftService = require("./ShiftService");
const history = require("./HistoryService");
const Response = require("../helpers/Response");

class ValidationService {
  static async salesSettlementValidation(attendanceId, companyId, userId) {
    try {


      let attendanceDetail = await AttendanceService.get(attendanceId, companyId);

      if (!attendanceDetail) {
        throw { message: "Attendance Not found" };
      }
      let salesSettlementDetail = await SaleSettlement.findOne({
        where: {
          date: attendanceDetail.date,
          store_id: attendanceDetail.store_id,
          shift: attendanceDetail.shift_id,
          company_id: companyId,
        },
      });

      if (!salesSettlementDetail) {
        let locationData = await LocationModel.findOne({ where: { id: attendanceDetail?.store_id, company_id: companyId } })
        if (locationData?.sales_settlement_required == Location.SALES_SETTLEMENT_REQUIRED_ENABLED) {
          throw { message: "Update Sales Settlement" };
        }
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async salesSettlementValidationOnAdd(userId, roleId,companyId, res) {
    try {
      let isValidationShiftHoursOnSaleSettlementAdd =
      await getSettingValueByObject(
          Setting.VALIDATE_SHIFT_TIME_ON_SALE_SETTLEMENT_ADD,
          companyId,
        roleId,
        ObjectName.ROLE
      );
  
      let currentShiftTime = await ShiftService.getCurrentShiftTimeByUserId(userId, companyId);
  
  
      if (isValidationShiftHoursOnSaleSettlementAdd == "true") {
        if (
          currentShiftTime.currentTime &&
          currentShiftTime &&
          currentShiftTime.shiftEndTime &&
          currentShiftTime.currentTime > currentShiftTime.shiftEndTime
        ) {
          return res.json(Response.OK, { message: "Validation Successfully" });
        } else{
          return res.json(Response.BAD_REQUEST, { message: "Shift Not Yet Completed" });

        }
      }else{
          return res.json(Response.OK, { message: "Validation Successfully" });
      }
    } catch (err) {
      console.log(err);
      res.json(500, { message: "Internal Server Error" });
    }
  }
  

  static async fineValidation(companyId, userId, res) {
    try {
      let where = {};

      let CompletedStatus = await StatusService.Get(ObjectName.FINE, Status.GROUP_COMPLETED, companyId);

      where.user = userId;
      where.due_date = { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) };
      where.status = { [Op.ne]: CompletedStatus?.id };
      let fineDetail = await FineBonus.findAll({ where: where });

      if (fineDetail && fineDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${fineDetail.length} pending Fines` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }


  static async validateShiftHoursOnCheckout(attendanceId, companyId, roleId) {
    try {
     
    let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);
        
    let attendanceDetail = await AttendanceModel.findOne({
      where: { id: attendanceId, company_id: companyId },
      include: [
        {
          required: true,
          model: Shift,
          as: "shift",
        },
      ]
    })

      let { login, shift } = attendanceDetail;

      let loginTime = DateTime.toGMT(login,userDefaultTimeZone)

      let currentTime = DateTime.toGMT(new Date(),userDefaultTimeZone)

      const formattedTimeDifference = DateTime.getHours(loginTime,currentTime);
  
      let shiftTime = DateTime.getTimeDifference(shift?.start_time,shift?.end_time)
      let req = { user: {} }; 
      req.user.company_id = companyId;
      
      if (!attendanceDetail?.allow_early_checkout) {
        if ( formattedTimeDifference) {
          if (formattedTimeDifference < shiftTime){
            throw { message: `Minimunm Working Hours less then ${shiftTime}`};
          }
        }
      }

      history.create(`Working Hours: ${formattedTimeDifference} / Shift Hours: ${shiftTime}`, req, ObjectName.USER, attendanceDetail?.user_id);

    } catch (err) {
      throw { message: err.message };
    }
  }

  // order validation

  static async orderValidation(companyId, userId, res) {
    try {
      let where = {};

      let draftStatus = await StatusService.Get(ObjectName.ORDER_TYPE, Status.GROUP_DRAFT, companyId);
      where.owner = userId;
      where.company_id = companyId
      where.date = {
        [Op.and]: {
          [Op.gte]: DateTime.toGetISOStringWithDayStartTime(new Date()),
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(new Date()),
        },
      },
        where.status = draftStatus?.id;
      let orderDetail = await order.findAll({ where: where });

      if (orderDetail && orderDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${orderDetail.length} Drfat Orders` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  //shift validation
  static async shiftValidation(attendanceId, companyId, res) {
    try{
    let timeZone = await UserService.getTimeZone(companyId)
    let where = {}
    if (attendanceId) {
      where.id = attendanceId
    }
    where.company_id = companyId
    let query = {
      where,
      include: [
        {
          required: true,
          model: Shift,
          as: "shift",
        },
      ]
    }

    let attendanceDetail = await AttendanceService.findOne(query)
    let currentTime = DateTime.getCurrentTimeByTimeZone(timeZone);
    let shiftEndTime = DateTime.convertGmtTimeToUserTimeZone(attendanceDetail?.shift?.end_time,timeZone)
    if (attendanceDetail && !attendanceDetail?.allow_early_checkout) {
      let req = { user: {} }; 
     req.user.company_id = companyId;
     req.user.id = attendanceDetail?.user_id;

    history.create(`Current Time: ${currentTime} / Shift End Time: ${shiftEndTime}`, req, ObjectName.USER, attendanceDetail?.user_id);
      if (currentTime && shiftEndTime && currentTime < shiftEndTime) {
        return res.json(Response.BAD_REQUEST, {
          message: "Your Shift Time is not yet Completed",
        });
      }
    }
}catch(err){
  throw { message: err.message };
}
}

  // bill validation

  static async billValidation(companyId, userId, res) {
    try {
      let where = {};

      let CompletedStatus = await StatusService.Get(ObjectName.BILL, Status.GROUP_COMPLETED, companyId);

      where.owner_id = userId;
      where.due_date = { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) };
      where.status = { [Op.ne]: CompletedStatus?.id };

      let billDetail = await Bill.findAll({ where: where });

      if (billDetail && billDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${billDetail.length} pending Bills` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  // payment validation
  static async paymentValidation(companyId, userId, res) {
    try {
      let where = {};

      let CompletedStatus = await StatusService.Get(ObjectName.PAYMENT, Status.GROUP_COMPLETED, companyId);

      where.owner_id = userId;
      where.due_date = { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) };
      where.status = { [Op.ne]: CompletedStatus?.id };

      let paymentDetail = await Payment.findAll({ where: where });
      if (paymentDetail && paymentDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${paymentDetail.length} pending payment` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  // transfer validation
  static async transferValidation(companyId, userId, res) {
    try {
      let where = {};

      let CompletedStatus = await StatusService.Get(ObjectName.TRANSFER, Status.GROUP_COMPLETED, companyId);

      where.owner_id = userId;
      where.date = { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) };
      where.status = { [Op.ne]: CompletedStatus?.id };
      let transferDetail = await Transfer.findAll({ where: where });

      if (transferDetail && transferDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${transferDetail.length} pending Transfer` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  // purchase validation
  static async purchaseValidation(companyId, userId, res) {
    try {
      let where = {};

      let CompletedStatus = await StatusService.Get(ObjectName.PURCHASE, Status.GROUP_COMPLETED, companyId);

      where.owner_id = userId;
      where.due_date = { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) };
      where.status = { [Op.ne]: CompletedStatus?.id };
      let purchaseDetail = await Purchase.findAll({ where: where });

      if (purchaseDetail && purchaseDetail.length > 0) {
        return res.json(Response.BAD_REQUEST, { message: `You have ${purchaseDetail.length} pending Purchase` });
      }
    } catch (err) {
      throw { message: err.message };
    }
  }

  static async pendingTicketValidation(companyId, userId) {
    try {
      let ticketList = await TicketIndex.findAll({
        where: {
          company_id: companyId,
          [Op.or]: [
            { reviewer: userId },
            { assignee_id: userId }
        ],
          status_group_id: { [Op.ne]: Status.GROUP_COMPLETED },
          due_date: { [Op.lte]: DateTime.getSQlFormattedDate(new Date()) },
        },
      });
      let pendingTicket = ticketList && ticketList.map(value => value.dataValues.ticket_number);

      if (ticketList && ticketList.length > 0) {
         
        throw { message: `You Have Pending Tickets \n${pendingTicket.join('\n')}` };      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async storyPointValidation(companyId,roleId, userId,attendanceId) {
    try {
      let attendanceDetail = await AttendanceService.get(attendanceId,companyId);

      if(attendanceDetail && !attendanceDetail?.allow_goal_missing){
      let isValidateMinimumStoryPoints = await getSettingValueByObject(Setting.MINIMUM_STORY_POINTS, companyId, roleId, ObjectName.ROLE);

      let storyPoints = await TicketIndex.sum("story_points", {
        where: {
          assignee_id: userId,
          status_group_id: { [Op.eq]: Status.GROUP_COMPLETED },
          due_date: new Date(),
          company_id: companyId,
        },
      }) || 0;

      if (Number.isNotNull(isValidateMinimumStoryPoints) && storyPoints < isValidateMinimumStoryPoints) {
        throw { message: `Goal Missing: Your Ticket Story Point Is ${storyPoints} (Lesser Than ${isValidateMinimumStoryPoints})` };
      }
    }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async timeSheetValidation(companyId, roleId, userId,attendanceId) {
    try {
      let validate_shift_hours_on_checkout = await getSettingValueByObject(Setting.VALIDATE_SHIFT_HOURS_ON_CHECKOUT, companyId, roleId, ObjectName.ROLE);

      let attendanceDetail = await AttendanceModel.findOne({
        where:{
          id: attendanceId,
          company_id: companyId
        },
        include: [
          {
            required: true,
            model: Shift,
            as: "shift",
          }
        ]
      })
      let workedHours = 0;

      if (validate_shift_hours_on_checkout && attendanceDetail?.allow_early_checkout == false) {

  
        let workingHours = DateTime.getTimeDifference(attendanceDetail?.shift?.start_time,attendanceDetail?.shift?.end_time)

        let timeSheets = await TimeSheet.findOne({
          where: { user_id: userId, company_id: companyId, date: DateTime.getSQlFormattedDate() },
        });

        if (timeSheets) {
          let timeSheetDetail = await TimeSheetDetail.findAll({
            where: { company_id: companyId, timesheet_id: timeSheets.id },
          });

          if (timeSheetDetail && timeSheetDetail.length > 0) {
            for (let i = 0; i < timeSheetDetail.length; i++) {
              workedHours += Number.GetFloat(timeSheetDetail[i].duration);
            }
            if (workedHours > 0 && DateTime.timeStringToDecimal(workingHours) > workedHours) {
              throw {
                message: `Yout time sheet hours (${Time.formatHoursMinutes(
                  workedHours
                )}) are less than the working hours (${workingHours} hours)`,
              };
            } else if (DateTime.timeStringToDecimal(workingHours) > workedHours) {
              throw { message: "Missed to add time sheet" };
            }
          } else {
            throw { message: "Missed to add today time sheet" };
          }
        } else {
          throw { message: "Missed to add today time sheet" };
        }
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }
  static async checkInValidation(companyId, roleId, userId) {
    try {
      let roleSetting =
        (await getSettingValueByObject(
          Setting.VALIDATE_PENDING_CHECKOUT_ON_ATTENDANCE_CHECKIN,
          companyId,
          roleId,
          ObjectName.ROLE
        )) == "true"
          ? true
          : false;

      if (roleSetting) {
        let query = {
          where: {
            company_id: companyId,
            user_id: userId,
            login: {[Op.ne]:null},
            logout: null,

          }
        }
        let attendanceData = await AttendanceService.findAll(query);

        return attendanceData;
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static getValueByObject(name, settingList, objectId, objectName) {
    for (const setting of settingList) {
      if (setting.object_name == objectName && setting.object_id == objectId && setting.name == name) {
        return setting.value;
      }
    }
    return null;
  }

  static async replenishedMinimumQuantityValidation(companyId, roleId, userId,attendanceId) {
    try {
      let attendanceDetail = await AttendanceService.get(attendanceId,companyId);

      if(attendanceDetail && !attendanceDetail?.allow_goal_missing){
      let minimumReplenishProducts = await getSettingValueByObject(Setting.MINIMUM_REPLENISH_PRODUCTS, companyId, roleId, ObjectName.ROLE);

      let params = {
        user: userId,
        company_id: companyId,
        date: new Date(),
      };
      let data = await TransferProductReportService.getTransferProductCount(params);
          if (Number.isNotNull(minimumReplenishProducts) && data.totalProductCount < parseInt(minimumReplenishProducts)) {
          throw { message: `Goal Missing: Your Replenished Quantity Is ${data.totalProductCount} (Lesser Than ${minimumReplenishProducts})` };
         
          }
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async activityValidation(companyId, roleId, userId,attendanceId) {
    try {
      let attendanceDetail = await AttendanceService.get(attendanceId,companyId);

      if(attendanceDetail && !attendanceDetail?.allow_goal_missing){
        const status = await StatusService.Get(ObjectName.ACTIVITY,Status.GROUP_PENDING,companyId);

      let query = {
        where:{
          owner_id: userId,
          company_id: companyId,
          status: status && status?.id,
          date: {
            [Op.and]: {
              [Op.lte]: DateTime.toGetISOStringWithDayEndTime(new Date()),
            }
          }
        }
      };
      const ActivityData = await Activity.count(query);
          if (ActivityData &&  ActivityData > 0) {
          throw { message: `Goal Missing: You Have ${ActivityData} Pending Activites ` };
          }
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async lateCheckInValidation (attendanceId,companyId){
    let attendanceDetail = await AttendanceService.get(attendanceId,companyId)
    if(attendanceDetail && !attendanceDetail?.approve_late_check_in){
      if(attendanceDetail && attendanceDetail?.late_hours && attendanceDetail?.late_hours > 0){
        throw { message:"Late Check-In Approval Pending" }
      }
    }
  }

  static async repotedMinimumStoryPointsOnCheckOut(companyId,roleId, userId,attendanceId){
    try {
      let attendanceDetail = await AttendanceService.get(attendanceId,companyId);

      if(attendanceDetail && !attendanceDetail?.allow_goal_missing){
      let isValidateRepotedMinimumStoryPoints = await getSettingValueByObject(Setting.REPORTED_TICKETS_MINIMUM_STORY_POINTS, companyId, roleId, ObjectName.ROLE);
      let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);

      let statDate=DateTime.toGetISOStringWithDayStartTime(new Date())
      let endDate =DateTime.toGetISOStringWithDayEndTime(new Date())

      let storyPoints = await TicketIndex.sum("story_points", {
        where: {
          reporter_id: userId,
          createdAt:{[Op.and]: {
            [Op.gte]: DateTime.toGMT(statDate,userDefaultTimeZone),
            [Op.lte]: DateTime.toGMT(endDate,userDefaultTimeZone),
          }},
          company_id: companyId,
        },
      }) || 0;
      if (Number.isNotNull(isValidateRepotedMinimumStoryPoints) && storyPoints < isValidateRepotedMinimumStoryPoints) {
        throw { message: `Goal Missing: Your Reported Tickets Story Point Is ${storyPoints} (Lesser Than ${isValidateRepotedMinimumStoryPoints})` };
      }
    }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async pendingSaleSettlementValidation(companyId,roleId,attendanceId){
    try {
      let attendanceDetail = await AttendanceService.get(attendanceId,companyId);

      if(attendanceDetail && !attendanceDetail?.allow_goal_missing){
      let isValidatePendingSaleSettlementValidation = await getSettingValueByObject(Setting.VALIDATE_PENDING_SALES_SETTLEMENT_ON_ATTENDANCE_CHECKOUT, companyId, roleId, ObjectName.ROLE);
      if(isValidatePendingSaleSettlementValidation){

      const status = await StatusService.Get(ObjectName.SALE_SETTLEMENT,Status.GROUP_PENDING,companyId);

      let SaleSettlementData = await SaleSettlement.findAll({where:{company_id:companyId, date:attendanceDetail?.date,reviewer:attendanceDetail?.user_id, status:status && status?.id}})

      let pendingSaleSettlement = SaleSettlementData && SaleSettlementData.map(value => value.dataValues.sale_settlement_number);

      if (pendingSaleSettlement && pendingSaleSettlement.length > 0) {
        throw { message: `You Have Pending ${pendingSaleSettlement.length>1 ?"Sales Settlements":"Sales Settlement"} \n${pendingSaleSettlement.join('\n')}` };      }
      }
    }
    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async attendanceCheckOut(attendanceId, companyId, roleId, userId, res) {
    try {
      let settingArray = [];
      let settingList = await getSettingList(companyId);

      for (let i = 0; i < settingList.length; i++) {
        settingArray.push(settingList[i]);
      }

      let isValidatePendingSaleSettlementOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_SALES_SETTLEMENT_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingPurchaseOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_PURCHASES_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidateSaleSettlementOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_SALES_SETTLEMENT_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingFineOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_FINES_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingOrderOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_ORDERS_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingBillsOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_BILLS_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingPaymentOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_PAYMENTS_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingTransferOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_TRANSFER_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidatePendingTicketOnAttendanceCheckoutEnabled = this.getValueByObject(
        Setting.VALIDATE_PENDING_TICKET_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidateTicketMinimumStoryPointsOnCheckOut = this.getValueByObject(
        Setting.VALIDATE_TICKET_MINIMUM_STORY_POINTS_ON_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidateTimeSheetOnAttendanceCheckOut = this.getValueByObject(
        Setting.VALIDATE_TIMESHEET_ON_ATTENDANCE_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );

      let isValidateShiftTimeOnAttendanceCheckOutEnabled = await getSettingValueByObject(
        Setting.VALIDATE_SHIFT_TIME_ON_CHECKOUT,
        companyId,
        roleId,
        ObjectName.ROLE
      );

      /* ✴---Replenish Validation---✴ */
      let isValidateMinimumReplenishProductsOnCheckout = this.getValueByObject(
        Setting.VALIDATE_MINIMUM_REPLENISH_PRODUCTS_ON_CHECKOUT,
        settingList,
        roleId,
        ObjectName.ROLE
      );


        /* ✴---Activites Validation---✴ */
        let isValidatePendingActivitiesOnAttendanceCheckout = this.getValueByObject(
          Setting.VALIDATE_PENDING_ACTIVITIES_ON_ATTENDANCE_CHECKOUT,
          settingList,
          roleId,
          ObjectName.ROLE
        );

        /* ✴---Late Check-In Validation---✴ */
        let isValidateLateCheckinOnCheckout = this.getValueByObject(
          Setting.VALIDATE_LATE_CHECKIN_ON_CHECKOUT,
          settingList,
          roleId,
          ObjectName.ROLE
        );

           /* ✴---Reported Ticket Minium Story Points OnCheckout---✴ */
           let isValidateReportedMinimumStoryPointOnCheckout = this.getValueByObject(
            Setting.VALIDATE_REPORTED_TICKETS_MINIMUM_STORY_POINTS_ONCHECKOUT,
            settingList,
            roleId,
            ObjectName.ROLE
          );

          let isValidateShiftHoursOnCheckout = await getSettingValueByObject(
            Setting.VALIDATE_SHIFT_HOURS_ON_CHECKOUT,
            companyId,
            roleId,
            ObjectName.ROLE,
          );
  
      // Validations
      if (isValidateSaleSettlementOnAttendanceCheckoutEnabled == "true") {
        await this.salesSettlementValidation(attendanceId, companyId, userId);
      }


       // Validations
       if (isValidateShiftHoursOnCheckout == "true") {
        await this.validateShiftHoursOnCheckout(attendanceId, companyId, roleId);
      }
      if (isValidatePendingFineOnAttendanceCheckoutEnabled == "true") {
        await this.fineValidation(companyId, userId, res);
      }

      if (isValidatePendingOrderOnAttendanceCheckoutEnabled == "true") {
        await this.orderValidation(companyId, userId, res);
      }

      if (isValidatePendingBillsOnAttendanceCheckoutEnabled == "true") {
        await this.billValidation(companyId, userId, res);
      }
      if (isValidatePendingTransferOnAttendanceCheckoutEnabled == "true") {
        await this.transferValidation(companyId, userId, res);
      }

      if (isValidatePendingPaymentOnAttendanceCheckoutEnabled == "true") {
        await this.paymentValidation(companyId, userId, res);
      }

      if (isValidatePendingPurchaseOnAttendanceCheckoutEnabled == "true") {
        await this.purchaseValidation(companyId, userId, res);
      }

      if (isValidatePendingTicketOnAttendanceCheckoutEnabled == "true") {
        await this.pendingTicketValidation(companyId, userId);
      }

      if (isValidateTimeSheetOnAttendanceCheckOut == "true") {
        await this.timeSheetValidation(companyId, roleId, userId,attendanceId);
      }
      
      if (isValidateTicketMinimumStoryPointsOnCheckOut == "true") {
        await this.storyPointValidation(companyId,roleId, userId,attendanceId);
      }

      if (isValidateShiftTimeOnAttendanceCheckOutEnabled === "true") {
        await this.shiftValidation(attendanceId, companyId, res)
      }

      if (isValidateMinimumReplenishProductsOnCheckout === "true") {
        await this.replenishedMinimumQuantityValidation(companyId, roleId, userId,attendanceId)
      }

      if (isValidatePendingActivitiesOnAttendanceCheckout === "true") {
        await this.activityValidation(companyId, roleId, userId,attendanceId)
      }

      if(isValidateLateCheckinOnCheckout === "true"){
        await this.lateCheckInValidation(attendanceId,companyId)
      }

      if(isValidateReportedMinimumStoryPointOnCheckout === "true"){
        await this.repotedMinimumStoryPointsOnCheckOut(companyId,roleId, userId,attendanceId)
      }
      if (isValidatePendingSaleSettlementOnAttendanceCheckoutEnabled == "true") {
        await this.pendingSaleSettlementValidation(companyId,roleId,attendanceId);
      }

    } catch (err) {
      console.log(err);
      throw { message: err.message };
    }
  }

  static async ValidateLocation(roleId, ip_address, companyId, type) {
    try {
      
      if (roleId && ip_address) {

      
        let allowedLocationsValues = await getSettingValueByObject(Setting.ALLOWED_LOCATIONS, companyId, roleId, ObjectName.ROLE);

        if ( allowedLocationsValues) {

          let matchFound = false;

        
          if (allowedLocationsValues) {
            const allowedLocations = allowedLocationsValues && allowedLocationsValues.split(",");
            if(allowedLocations && allowedLocations.length >0){
              for (let i = 0; i < allowedLocations.length; i++) {
                const storeDetail = await LocationModel.findOne({ where: { id: allowedLocations[i] } });
  
                if (storeDetail?.ip_address === ip_address) {
                  matchFound = true;
                  break;
                }
              }
            }
          }

          if (!matchFound) {
            throw { message: `You are not allowed to ${type} from outside work location` }
          }
        }
      }
    } catch (err) {
      console.log(err);
      throw { message: err.message }
    }
  }

}

module.exports = ValidationService;
