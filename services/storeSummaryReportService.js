//Email
const mailService = require('./MailService');
const {
  order,
  Attendance,
  Tag,
  User,
  Shift,
  Visitor,
  Location: LocationModel,
  TransferProduct,
  SaleSettlement,
  orderProduct,
  productIndex,
} = require('../db').models;

//Service
const DataBaseService = require('../lib/dataBaseService');
const DateTime = require('../lib/dateTime');
const Currency = require('../lib/currency');
const { Op, Sequelize, QueryTypes } = require('sequelize');
const storeNoCheckInNotificationService = require('./storeNoCheckInNotificationService');
const noOrderEmailService = require('./noOrderReportService');
const Setting = require('../helpers/Setting');
const { getSettingList, getValueByObject, getSettingListByName, getSettingValue } = require('./SettingService');
const String = require('../lib/string');
const Status = require('../helpers/Status');
const Location = require('../helpers/Location');
const CompanyService = require("./CompanyService");
const ShiftService = require("./ShiftService");
const db = require("../db");
const { getMediaURL } = require("./MediaService");

const UserRoleService = require("./UserRoleService");
const { listByRolePermission } = require("./UserService");
const UserService = require("./UserService");
const StatusService = require("./StatusService");
const ObjectName = require("../helpers/ObjectName");
const AttendanceTypeService = require("./AttendanceTypeService");
const ArrayList = require("../lib/ArrayList");
class DailySummaryReportEmailService extends DataBaseService {
  async getReplenishData(params) {
    try {
      let where = {};
      where.createdAt = {
        [Op.and]: {
          [Op.gte]: params.startDate,
          [Op.lte]: params.endDate,
        },
      };

      let { allowedUserIds } = await UserService.listByRolePermission(Setting.REPLENISHMENT_ADD,params.companyId)


      if (allowedUserIds && allowedUserIds.length > 0) {
        where.created_by = { [Op.in]: allowedUserIds };
      }

      let query = {
        where: where,
        include: [
          {
            required: false,
            model: User,
            as: 'userDetail',
          },
        ],
        attributes: [
          'created_by',
          'product_id',
          [Sequelize.literal(`CASE WHEN COUNT(*) > 1 THEN 1 ELSE COUNT(*) END`), 'count'],
        ],
        group: ['created_by', 'product_id', 'userDetail.id'],
        raw: true,
      };
      const TransferProductData = await TransferProduct.findAndCountAll(query);

      let transferQuery = {
        where: where,
        include: [
          {
            required: false,
            model: User,
            as: 'userDetail',
          },
        ],
        attributes: ['created_by'],
        group: ['created_by', 'userDetail.id'],
        raw: true,
      };
      const TransferData = await TransferProduct.count(transferQuery);
      let arrayData = [];

      let TransferProductDataList = TransferProductData && TransferProductData.rows;
      if (TransferProductDataList && TransferProductDataList.length > 0) {
        for (let i = 0; i < TransferProductDataList.length; i++) {
          const values = TransferProductDataList[i];

          let transferProductData = TransferData.find(
            (data) => data.created_by == values?.created_by
          );

          arrayData.push({
            user_id: values?.created_by,
            userName: String.concatName(values['userDetail.name'], values['userDetail.last_name']),
            image: values['userDetail.media_url'],
            count: transferProductData.count,
          });
        }
      }
      const userCounts = {};

      arrayData.forEach((item) => {
        const userId = item.user_id;
        if (!userCounts[userId]) {
          userCounts[userId] = { product_count: 1, ...item };
        } else {
          userCounts[userId].product_count++;
        }
      });
      // Convert the userCounts object into an array of objects
      const list = Object.values(userCounts);

      list.sort((a, b) => a.product_count - b.product_count);
      const totalProductCount = list.reduce((acc, item) => acc + item.product_count, 0);

      let data = {
        list,
        totalProductCount,
      };
      return data;
    } catch (err) {
      console.log(err);
    }
  }



   async getOrderValue  (locationId, date, companyId) {
    let defaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);

    let start_date = DateTime.toGetISOStringWithDayStartTime(new Date(date))
    let end_date = DateTime.toGetISOStringWithDayEndTime(new Date(date))
    try {
      const result = await db.connection.query(
        `SELECT COUNT(*) as totalOrders, SUM(total_amount) as totalAmount 
         FROM "order" 
         WHERE store_id = :locationId AND company_id = :companyId
         AND date BETWEEN :startDate AND :endDate`,
        {
          replacements: { locationId, startDate: DateTime.toGMT(start_date,defaultTimeZone), endDate: DateTime.toGMT(end_date,defaultTimeZone), companyId },
          type: QueryTypes.SELECT
        }
      );
      return result[0];
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };


   async getOrderData (params) {
    const locationWhere = {};

    locationWhere.company_id = params.companyId;
    locationWhere.status = Status.ACTIVE_TEXT;
    locationWhere.type = Location.TYPE_STORE;
    const LocationQuery = {
      order: [['name', 'ASC']],
      where: locationWhere,
      attributes:["id","name"]
    };
    let locationData = await LocationModel.findAll(LocationQuery);
    let orderArrayList=[]
    if(locationData && locationData.length > 0){
      for (let i = 0; i < locationData.length; i++) {
        const { name, id } = locationData[i];
        let orderList = await this.getOrderValue(id, new Date(), params.companyId)
        if(orderList?.totalorders > 0){

          orderArrayList.push({
            locationName: name,
            totalOrders: orderList?.totalorders,
            totalAmount: Currency.IndianFormat(orderList?.totalamount)
          })
        }

      }

      return orderArrayList.sort((a, b) => {
        const amountA = parseFloat(a.totalAmount.replace(/[^0-9.-]+/g, ""));
        const amountB = parseFloat(b.totalAmount.replace(/[^0-9.-]+/g, ""));
        return amountB - amountA;
      });
    }
  }
  

  async getDraftOrderData(params) {
    let draftStatus = await StatusService.Get(ObjectName.ORDER_TYPE,Status.GROUP_DRAFT,params.companyId)
    try {
      const where = {};
      where.company_id = params.companyId;
      where.status = draftStatus && draftStatus?.id
      where.date = {
        [Op.and]: {
          [Op.gte]: params.startDate,
          [Op.lte]: params.endDate,
        },
      };
      const query = {
        include: [
          {
            required: true,
            model: LocationModel,
            as: 'location',
          },
          {
            required: true,
            model: User,
            as: 'ownerDetail',
          },
        ],
        where,
      };
      const locationWhere = {};

      locationWhere.company_id = params.companyId;
      locationWhere.status = Status.ACTIVE_TEXT;
      locationWhere.type = Location.TYPE_STORE;

      const LocationQuery = {
        order: [['name', 'ASC']],
        where: locationWhere,
      };
      let locationData = await LocationModel.findAll(LocationQuery);

      let draftOrderArray = [];
      let totalCount = 0;

      for (let index = 0; index < locationData.length; index++) {
        let list = [];

        where.store_id = locationData[index].id;

        let orderList = await order.findAll(query);
        if (orderList && orderList.length > 0) {
          for (let i = 0; i < orderList.length; i++) {
            const { ownerDetail, location } = orderList[i];

            list.push({
              userName: String.concatName(ownerDetail?.name, ownerDetail?.last_name),
              image: ownerDetail?.media_url,
              locationName: location?.name,
            });
          }
        }
        const data = list.reduce((acc, current) => {

          const existingEntry = acc.find((item) => item.owner === current.owner);


          if (existingEntry) {
            existingEntry.count++;
          } else {
            const { date, ...rest } = current;
            const entry = { ...rest, count: 1 };
            acc.push(entry);
          }

          return acc;
        }, []);
        data.sort((a, b) => b.count - a.count);
        if (list.length > 0) {
          draftOrderArray.push({ totalCount: list.length, list: data });
        }
      }
      draftOrderArray.sort((a, b) => b.totalCount - a.totalCount);
      for (let i = 0; i < draftOrderArray.length; i++) {
        totalCount += draftOrderArray[i].totalCount;
      }
      return { draftOrderArray, totalCount };
    } catch (err) {
      console.log(err);
    }
  }

  async getCancelOrderdata(params) {
    try {
      const where = {};
      where.company_id = params.companyId;
      where.cancelled_at = {
        [Op.and]: {
          [Op.gte]: params.startDate,
          [Op.lte]: params.endDate,
        },
      };
      const query = {
        include: [
          {
            required: true,
            model: LocationModel,
            as: 'location',
          },
          {
            required: true,
            model: User,
            as: 'ownerDetail',
          },
        ],
        where,
      };
      const locationWhere = {};

      locationWhere.company_id = params.companyId;
      locationWhere.status = Status.ACTIVE_TEXT;
      locationWhere.type = Location.TYPE_STORE;

      const LocationQuery = {
        order: [['name', 'ASC']],
        where: locationWhere,
      };
      let locationData = await LocationModel.findAll(LocationQuery);

      let cancelOrderArray = [];
      let totalCount = 0;

      for (let index = 0; index < locationData.length; index++) {
        let list = [];

        where.store_id = locationData[index].id;

        let orderList = await order.findAll(query);
        if (orderList && orderList.length > 0) {
          for (let i = 0; i < orderList.length; i++) {
            const { ownerDetail, location } = orderList[i];

            list.push({
              userName: String.concatName(ownerDetail?.name, ownerDetail?.last_name),
              image: ownerDetail?.media_url,
              locationName: location?.name,
            });
          }
        }
        const data = list.reduce((acc, current) => {

          
          const existingEntry = acc.find((item) => item.owner === current.owner);


          if (existingEntry) {
            existingEntry.count++;
          } else {
            const { date, ...rest } = current;
            const entry = { ...rest, count: 1 };
            acc.push(entry);
          }

          return acc;
        }, []);
        data.sort((a, b) => b.count - a.count);
        if (list.length > 0) {
          cancelOrderArray.push({ totalCount: list.length, list: data });
        }
      }
      cancelOrderArray.sort((a, b) => b.totalCount - a.totalCount);
      for (let i = 0; i < cancelOrderArray.length; i++) {
        totalCount += cancelOrderArray[i].totalCount;
      }
      return { cancelOrderArray, totalCount };
    } catch (err) {
      console.log(err);
    }
  }

  async getVisitorData(params) {
    let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, params.companyId);
    const where = {};

    where.created_at = {
      [Op.and]: {
        [Op.gte]: params.startDate,
        [Op.lte]: params.endDate,
      },
    };
    const query = {
      include: [
        {
          required: false,
          model: Tag,
          as: 'tagDetails',
        },
      ],
      order: [['created_at', 'DESC']],
      where,
    };
    const data = [];

    const visitorData = await Visitor.findAll(query);
    if (visitorData && visitorData.length > 0) {
      visitorData.forEach(async (visitor) => {
        const { id, name, created_at, tagDetails, purpose, media_id } = visitor.get();
        data.push({
          id,
          name: name,
          dateTime: DateTime.getDateTimeByUserProfileTimezone(created_at,userDefaultTimeZone),
          media_url: media_id ? await getMediaURL(media_id, params.companyId) : "",
          typeName: tagDetails?.name ? tagDetails?.name : '',
          purpose: purpose ? purpose :""
        });
      });
    }

    return { data: data, count: visitorData.length };
  }

  async getAdditionalDayAndShift(params) {
    try {
      let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, params.companyId);
      let todayDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(userDefaultTimeZone));

      let additionalDayIds = await AttendanceTypeService.getAttendanceTypeId({is_additional_day:true, company_id: params?.companyId})

      // Query to retrieve additional day and shift data along with user, shift, and store associations
      const additionalDayAndShiftData = await Attendance.findAll({
        where: {
          type: {[Op.in]: additionalDayIds},
          date: todayDate,
        },
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'last_name', 'media_url'], 
          },
          {
            model: Shift,
            as: 'shift',
            attributes: ['id', 'name'],
          },
          {
            model: LocationModel,
            as: 'location', 
            attributes: ['id', 'name'], 
            where: {
              type: Location.TYPE_STORE,
            },
          },
        ],
      });

      // Return the additional day and shift data with user name, shift name, and store name
      return {
        count: additionalDayAndShiftData.length,
        data: additionalDayAndShiftData.map((data) => ({
          userName: data.user ? `${data.user.name} ${data.user.last_name}` : '',
          image: data.user ? data.user.media_url : '',
          shiftName: data.shift ? data.shift.name : '',
          locationName: data.location ? data.location.name : '', 
        })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSaleSettlementMissing(params) {
    try {
      let shiftId = await ShiftService.getCurrentShiftByTime(params?.roleId, params?.companyId);
      let locationList = await LocationModel.findAll({
        where: {
          status: Status.ACTIVE_TEXT,
          company_id: params.companyId,
          sales_settlement_required: Location.SALES_SETTLEMENT_REQUIRED_ENABLED,
          type: Location.TYPE_STORE,
        },
        order: [['name', 'ASC']],
      });

      let shiftList = await Shift.findAll({
        where: {
          company_id: params.companyId,
          status: Status.ACTIVE_TEXT,
          id: {
            [Op.notIn]: [shiftId],
          },
        },
      });
      let saleMissedList = new Array();
      if (shiftList && shiftList.length > 0) {
        for (let k = 0; k < shiftList.length; k++) {
          if (locationList && locationList.length > 0) {
            for (let i = 0; i < locationList.length; i++) {
              let saleExist = await SaleSettlement.findOne({
                where: {
                  company_id: params.companyId,
                  date: params.todayDate,
                  shift: shiftList[k]?.id,
                  store_id: locationList[i]?.id,
                },
              });

              if (!saleExist) {
                saleMissedList.push({
                  storeId: locationList[i]?.id,
                  location: locationList[i]?.name,
                  shiftName: shiftList[k]?.name,
                });
              }
            }
          }
        }
      }
      return saleMissedList;
    } catch (err) {
      console.log(err);
      throw { message: err };
    }
  }

  async getCashInLocationDetail(params) {
    try {
        let locationList = await LocationModel.findAll({
            where: {
                status: Status.ACTIVE_TEXT,
                company_id: params.companyId,
                type: Location.TYPE_STORE,
            },
            order: [["name", "ASC"]],
        });
    
        let cashInStoreDetail = [];
    
        if (locationList && locationList.length > 0) {
            for (let i = 0; i < locationList.length; i++) {
                if (
                    parseFloat(locationList[i]?.cash_in_location) < 
                    parseFloat(locationList[i]?.minimum_cash_in_store)
                ) {
                    cashInStoreDetail.push({
                        location: locationList[i]?.name,
                        minimumCashInStore: locationList[i]?.minimum_cash_in_store,
                        cashInLocation: locationList[i]?.cash_in_location,
                    });
                }
            }
        }
        return cashInStoreDetail;
    } catch (err) {
        console.log(err);
        throw { message: err };
    }
}

  async getTop10OrderData(companyId) {
    let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);
    let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
    let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())
    const where = {};
    where.company_id = companyId;
    where.date = {
      [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,userDefaultTimeZone),
        [Op.lte]: DateTime.toGMT(end_date,userDefaultTimeZone),
      },
    };
    const query = {
      include: [
        {
          required: true,
          model: LocationModel,
          as: "location",
        },
      ],
      order: [["total_amount", "DESC","NULLS LAST"]],
      where,
      limit:10
    };

    let orderList = await order.findAll(query);
    let list = [];
    if (orderList && orderList.length > 0) {
      for (let i = 0; i < orderList.length; i++) {
        const { total_amount, location, date } = orderList[i];
        list.push({
          total_amount: Currency.GetFormattedCurrency(total_amount),
          locationName: location && location?.name,
          date: DateTime.getCurrentDateTimeByUserProfileTimezone(date, userDefaultTimeZone),
        });
      }
    }
    return list;
  }

  async getTop10OrderProductData(companyId) {
    let timeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);
    let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
    let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())
    let statusDetail = await StatusService.getAllStatusByGroupId(ObjectName.ORDER_PRODUCT, Status.GROUP_CANCELLED, companyId);
    const statusIdsArray = statusDetail && statusDetail.length >0 && statusDetail.map(status => status.id);


    let query = `
  SELECT
    orderProduct.product_id,
    SUM(orderProduct.quantity) as total_quantity,
    SUM(orderProduct.mrp) as total_mrp,
    productIndex.product_name,  
    productIndex.brand_name,  
    productIndex.size,  
    productIndex.unit,  
    productIndex.mrp,  
    productIndex.featured_media_url,  
    productIndex.sale_price  
  FROM
    order_product orderProduct
  JOIN
    product_index productIndex ON orderProduct.product_id = productIndex.product_id
  WHERE
    orderProduct.company_id = ${companyId}
    AND orderProduct.product_id IN (
      SELECT product_id
      FROM order_product
      WHERE company_id = ${companyId}
      GROUP BY product_id
      ORDER BY SUM(mrp) DESC
    )
    AND orderProduct."createdAt" BETWEEN '${DateTime.toGMT(
      start_date,timeZone
    )}' AND '${DateTime.toGMT(end_date,timeZone)}' AND orderProduct.status NOT IN (${statusIdsArray})
  GROUP BY
    orderProduct.product_id,
    productIndex.product_name,  
    productIndex.brand_name,  
    productIndex.size,  
    productIndex.unit,  
    productIndex.mrp,  
    productIndex.featured_media_url,  
    productIndex.sale_price  
  ORDER BY
  productIndex.sale_price DESC NULLS LAST
	LIMIT 10;
`;

    let queryData = await db.connection.query(query);

    let orderProductData = queryData && queryData[0];

    let list = [];
    if(orderProductData && orderProductData.length >0){
      for (let i = 0; i < orderProductData.length; i++) {
        const value = orderProductData[i];
        list.push({
          product_name: value?.product_name ? value?.product_name :"",
          brand_name: value?.brand_name ? value?.brand_name:"",
          size: value?.size ? value?.size:"",
          unit: value?.unit? value?.unit:"",
          sale_price: value?.sale_price?value?.sale_price:"",
          mrp: value?.mrp? value?.mrp:"",
          pack_size: value?.pack_size ? value?.pack_size:"",
          media_url: value?.featured_media_url ? value?.featured_media_url:"",
          total_amount: value?.total_mrp ? Currency.GetFormattedCurrency(value?.total_mrp):"",
          quantity: value?.total_quantity
        });
      }
    }
    return list;
  }

  async sendMail(params, fromMail, toMail, callback) {
    try {
      const { companyId, schedularData, currentDate, roleId } = params;
      let settingArray = [];
      let settingList = await getSettingList(companyId);

      for (let i = 0; i < settingList.length; i++) {
        settingArray.push(settingList[i]);
      }

      const defaultTimeZone = params.timeZone;
      let companyDetail = await CompanyService.getCompanyDetailById(companyId);
      let todayDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(defaultTimeZone));

      let start_date = DateTime.toGetISOStringWithDayStartTime(todayDate)
      let end_date = DateTime.toGetISOStringWithDayEndTime(todayDate)

      let { startDate, endDate } = DateTime.getCustomDateTime(1,defaultTimeZone);

      let param = {
        companyId: companyId,
        id: schedularData?.id,
        name: schedularData?.name,
        toMail: toMail,
        currentDate: currentDate,
        summary: true,
        todayDate: todayDate,
        type: Location.TYPE_STORE,
        roleId: roleId,
        timeZone :  params.timeZone,
        startDate, 
        endDate
      };

      // No checkIn
      let nocheckInData = await storeNoCheckInNotificationService.sendMail(param, {}, (res) => {
        return res;
      });

      // Total Sale Amount
      let totalAmount = await order.sum('total_amount', {
        where: {
          company_id: companyId,
          date: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
      });

      // No Order
      let noOrderData = await noOrderEmailService.sendMail(param, (res) => {
        return res;
      });
      const attendanceWhereCondition = {};

      attendanceWhereCondition.date = todayDate;

      let additionalDayIds = await AttendanceTypeService.getAttendanceTypeId({is_additional_day:true, company_id: companyId })

      if(ArrayList.isArray(additionalDayIds)){
        attendanceWhereCondition.type = {[Op.in]: additionalDayIds};
      }

      const query = {
        include: [
          {
            required: true,
            model: User,
            as: 'user',
            attributes: ['name', 'last_name', 'media_url'],
          },

          {
            required: false,
            model: LocationModel,
            as: 'location',
          },
        ],
        order: [[{ model: User, as: 'user' }, 'name', 'ASC']],
        where: attendanceWhereCondition,
      };

      // Replenish
      let replenishData = await this.getReplenishData(param);




      let ordersData = await this.getOrderData(param)

      // Cancel Order
      let cancelOrder = await this.getCancelOrderdata(param);

      let draftOrder = await this.getDraftOrderData(param);

      let getTop10OrderData = await this.getTop10OrderData(companyId);
      let getTop10OrderProductData = await this.getTop10OrderProductData(companyId);
      let cancelOrderData = [];

      //  Cancel Order

      for (let index = 0; index < cancelOrder.cancelOrderArray.length; index++) {
        let cancelOrderValue = cancelOrder.cancelOrderArray[index];

        for (let i = 0; i < cancelOrderValue.list.length; i++) {
          cancelOrderData.push({
            userName: cancelOrderValue.list[i].userName,
            image: cancelOrderValue.list[i].image,
            locationName: cancelOrderValue.list[i].locationName,
            count: cancelOrderValue.totalCount,
          });
        }
      }

      let draftOrderData =[]
      for (let index = 0; index < draftOrder.draftOrderArray.length; index++) {
        let draftOrderValue = draftOrder.draftOrderArray[index];

        for (let i = 0; i < draftOrderValue.list.length; i++) {
          draftOrderData.push({
            userName: draftOrderValue.list[i].userName,
            image: draftOrderValue.list[i].image,
            locationName: draftOrderValue.list[i].locationName,
            count: draftOrderValue.totalCount,
          });
        }
      }

      let visitorData = await this.getVisitorData(param);

      let getAdditionalDayAndShift = await this.getAdditionalDayAndShift(param);

      let saleSettlementData = await this.getSaleSettlementMissing(param);

      let cashInLocationData = await this.getCashInLocationDetail(param);

      const totalOrders = ordersData.reduce((sum, order) => {
        return sum + parseInt(order.totalOrders, 10);
      }, 0);

      let cardData = {
        noCheckInCount: nocheckInData && nocheckInData.length,
        noOrderDataCount: noOrderData && noOrderData.length,
        totalAmount: totalAmount
          ? Currency.GetFormattedCurrency(totalAmount)
          : "",
        totalReplenishCount: replenishData && replenishData.totalProductCount,
        cancelOrderCount: cancelOrder && cancelOrder.totalCount,
        visitorDataCount: visitorData && visitorData.count,
        getAdditionalDayAndShiftCount:
          getAdditionalDayAndShift && getAdditionalDayAndShift.count,
        saleSettlementDataCount:
          saleSettlementData && saleSettlementData.length,
        cashInLocationData: cashInLocationData && cashInLocationData.length,
        draftOrderCount: draftOrder && draftOrder.totalCount,
        orderCount: totalOrders
      };

      // Email Substitution
      const emailSubstitutions = {
        nocheckInData: nocheckInData,
        noOrderData: noOrderData,
        date: DateTime.Format(params.currentDate),
        cardData: cardData,
        cashInLocationData: cashInLocationData,
        replenishData: replenishData.list,
        cancelOrderData: cancelOrderData,
        visitorData: visitorData.data,
        getAdditionalDayAndShiftData: getAdditionalDayAndShift,
        saleSettlementData: saleSettlementData,
        schedularName: schedularData?.name,
        companyLogo: companyDetail && companyDetail?.company_logo,
        companyName: companyDetail && companyDetail?.company_name,
        reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), defaultTimeZone),
        getTop10OrderData: getTop10OrderData,
        getTop10OrderProductData: getTop10OrderProductData,
        draftOrderData: draftOrderData,
        orderData: ordersData
      };
      
      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'storeSummaryReport',
        subject: `Store Summary Report - ${DateTime.Format(params.currentDate)}`,
        substitutions: emailSubstitutions,
      };

      // Sent Email
      mailService.sendMail(params, emailData, async (err) => {
        if (err) {
          console.log(err);
        }

        return callback();
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const dailySummaryReportEmailService = new DailySummaryReportEmailService();

module.exports = dailySummaryReportEmailService;
