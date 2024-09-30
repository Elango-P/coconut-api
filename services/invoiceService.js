const Order = require("../helpers/Order");
const Permission = require("../helpers/Permission");
const DateTime = require("../lib/dateTime");
const { getSettingValue } = require("./SettingService");
const validator = require("../lib/validator");
const Setting = require("../helpers/Setting");
const Number = require("../lib/Number");
const Boolean = require("../lib/Boolean");
const { Op, QueryTypes } = require("sequelize");
const statusService = require("./StatusService");
const db = require("../db");
const Request = require("../lib/request");
const {
  order,
  InvoiceModel,
  ProductInvoiceModel,
  status: statusModel,
  account,
  orderProduct,
  Location,
  Shift,
  User,
} = require("../db").models;
const Response = require("../helpers/Response");
const ObjectName = require("../helpers/ObjectName");
const UserService = require("./UserService");
const SlackService = require("./SlackService");
const Currency = require("../lib/currency");
const WhatsAppService = require("./WhatsAppService");
const ObjectHelper = require("../helpers/ObjectHelper");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
class InvoiceService {
  static async create(orderId, companyId) {
    try {
      const orderDetail = await order.findOne({
        where: { id: orderId, company_id: companyId },
      });
      const status = await statusService.getFirstStatusDetail(ObjectName.INVOICE, companyId);
      if (orderDetail) {
        let dataObject = {
          invoice_number: orderDetail && orderDetail?.order_number,
          order_id: orderDetail && orderDetail?.id,
          date: orderDetail && orderDetail?.date,
          total_amount: orderDetail && orderDetail?.total_amount,
          store_id: orderDetail && orderDetail?.store_id,
          company_id: orderDetail && orderDetail?.company_id,
          customer_account: orderDetail && orderDetail?.customer_account,
          status: status && status?.id,
          sales_executive_user_id:
            orderDetail && orderDetail?.owner,
          delivery_executive: orderDetail && orderDetail?.owner,
          shift: orderDetail && orderDetail?.shift,
          customer_phone_number:
            orderDetail && orderDetail?.customer_phone_number,
          type: orderDetail && orderDetail?.type,
          uuid: orderDetail && orderDetail?.uuid,
          payment_type: orderDetail && orderDetail?.payment_type,
          createdBy: orderDetail && orderDetail?.createdBy,
          total_sgst_amount: orderDetail && orderDetail?.total_sgst_amount,
          cash_amount: orderDetail && orderDetail?.cash_amount,
          upi_amount: orderDetail && orderDetail?.upi_amount,
          total_cgst_amount: orderDetail && orderDetail?.total_cgst_amount,
          cancelled_at: orderDetail && orderDetail?.cancelled_at,
        };

        let saleInvoiceData = await InvoiceModel.create(dataObject);

        if (saleInvoiceData && saleInvoiceData?.id) {
          const orderProductDetail = await orderProduct.findAll({
            where: { order_id: orderId, company_id: companyId },
          });
          const status = await statusService.getFirstStatusDetail(ObjectName.INVOICE_PRODUCT, companyId);
          if (orderProductDetail && orderProductDetail.length > 0) {
            for (let i = 0; i < orderProductDetail.length; i++) {
              let objectData = {
                invoice_id: saleInvoiceData?.id,
                product_id:
                  orderProductDetail[i] && orderProductDetail[i].product_id,
                  order_product_id:
                  orderProductDetail[i] && orderProductDetail[i].id,
                quantity:
                  orderProductDetail[i] && orderProductDetail[i].quantity,
                store_id:
                  orderProductDetail[i] && orderProductDetail[i].store_id,
                  status:status && status.id,
                price: orderProductDetail[i] && orderProductDetail[i].price,
                unit_price:
                  orderProductDetail[i] && orderProductDetail[i].unit_price,
                company_id:
                  orderProductDetail[i] && orderProductDetail[i].company_id,
                invoice_date:
                  orderProductDetail[i] && orderProductDetail[i].order_date,
                cost_price:
                  orderProductDetail[i] && orderProductDetail[i].cost_price,
                profit_amount:
                  orderProductDetail[i] && orderProductDetail[i].profit_amount,
                mrp: orderProductDetail[i] && orderProductDetail[i].mrp,
                cgst_percentage:
                  orderProductDetail[i] &&
                  orderProductDetail[i].cgst_percentage,
                cgst_amount:
                  orderProductDetail[i] && orderProductDetail[i].cgst_amount,
                sgst_percentage:
                  orderProductDetail[i] &&
                  orderProductDetail[i].sgst_percentage,
                sgst_amount:
                  orderProductDetail[i] && orderProductDetail[i].sgst_amount,
                taxable_amount:
                  orderProductDetail[i] && orderProductDetail[i].taxable_amount,
                invoice_number:
                  orderProductDetail[i] && orderProductDetail[i].order_number,
                cancelled_at:
                  orderProductDetail[i] && orderProductDetail[i].cancelled_at,
                reward:
                  orderProductDetail[i] && orderProductDetail[i].reward,
                manual_price:
                  orderProductDetail[i] && orderProductDetail[i].manual_price,
              };
              await ProductInvoiceModel.create(objectData);
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async search(params, req) {
    try {
      let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        status,
        customer_account,
        type,
        location,
        user,
        shift,
        startDate,
        endDate,
        paymentType,
        orderId,
        customer_phone_number,
        showTotal,
      } = params;
      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        throw { message: "Invalid page" };
      }
      const companyId = Request.GetCompanyId(req);

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        throw { message: "Invalid page size" };
      }

      // Sortable Fields
      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        store_order_id: "store_order_id",
        date: "date",
        total_amount: "total_amount",
        invoice_number: "invoice_number",
        createdAt: "createdAt",
        id: "id",
        updatedAt: "updatedAt",
        amount: "amount",
        status: "status",
        locationName: "store_id",
        salesExecutive: "sales_executive_user_id",
        shift: "shift",
        customer_phone_number: "customer_phone_number",
        createdBy: "createdBy",
        payment_type: "payment_type",
        assignee: "delivery_executive",
        cash_amount: "cash_amount",
        upi_amount: "upi_amount",
      };

      let timeZone = Request.getTimeZone(req);

      let start_date = DateTime.toGetISOStringWithDayStartTime(startDate);
      let end_date = DateTime.toGetISOStringWithDayEndTime(endDate);

      const hasPermission = await Permission.Has(
        Permission.ORDER_MANAGE_OTHERS,
        req
      );
      const sortParam = sort || "invoice_number";
      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
      }

      const data = params;
      let where = {};
      where.company_id = companyId;
      // Search by location id
      if (data.store_id) {
        where = { store_id: data.store_id };
      }

      // Search by name
      const name = data.name;
      if (name) {
        where.name = {
          $like: `%${name}%`,
        };
      }
      if (Number.isNotNull(orderId)) {
        where.id = orderId;
      }

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      if (paymentType) {
        where.payment_type = paymentType;
      }
      if (!hasPermission) {
        let userId = req && req.user && req.user.id;
        if (type == Order.TYPE_DELIVERY) {
          if (userId) {
            if (customer_account) {
              where.customer_account = userId;
            } else {
              where.delivery_executive = userId;
            }
          }
        } else {
          if (userId) {
            where.sales_executive_user_id = userId;
          }
        }
      }

      // Apply filters if there is one
      if (Number.isNotNull(location)) {
        where.store_id = Number.Get(location);
      }

      if (Number.isNotNull(shift)) {
        where.shift = shift;
      }

      if (user) {
        where.sales_executive_user_id = user;
      }

      if (startDate && !endDate) {
        where.date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date, timeZone),
          },
        };
      }

      if (endDate && !startDate) {
        where.date = {
          [Op.and]: {
            [Op.lte]: DateTime.toGMT(end_date, timeZone),
          },
        };
      }

      if (startDate && endDate) {
        where.date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date, timeZone),
            [Op.lte]: DateTime.toGMT(end_date, timeZone),
          },
        };
      }
      const whereLocation = {};

      whereLocation.company_id = Number.Get(companyId);

      const searchTerm = search ? search.trim() : null;
      if (searchTerm) {
        if (searchTerm && isNaN(parseFloat(searchTerm))) {
      
          where[Op.or] = [
            {
              "$location.name$": {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
            {
              invoice_number: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
          ];
        }
        if (
          typeof parseFloat(searchTerm) == "number" &&
          !isNaN(parseFloat(searchTerm))
        ) {
          where[Op.or] = [
            {
              invoice_number: {
                [Op.eq]: searchTerm,
              },
            },
            {
              customer_phone_number: {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
          ];
        }
      }

      // Include
      const include = [
        {
          required: false,
          model: Location,
          as: "location",
          attributes: ["id", "name"],
          where: whereLocation,
        },
        {
          required: false,
          model: Shift,
          as: "shiftDetail",
          attributes: ["name", "id"],
        },
        {
          model: User,
          as: "salesExecutive",
          attributes: ["name", "last_name", "media_url"],
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
        {
          required: false,
          model: statusModel,
          as: "statusDetail",
          attributes: ["name", "color_code", "id"],
        },
      ];
      const query = {
        order: [[sortableFields[sortParam], sortDirParam]],
        where,
        include,
      };

      if (validator.isEmpty(pagination)) {
        pagination = true;
      }
      if (Boolean.isTrue(pagination)) {
        if (pageSize > 0) {
          query.limit = pageSize;
          query.offset = (page - 1) * pageSize;
        }
      }

      let filterParams = {
        companyId: companyId,
        startDate: start_date ? start_date : "",
        endDate: end_date ? end_date : "",
        location: location,
        status: status,
        shift: shift,
        paymentType: paymentType,
        type: type,
        searchTerm: searchTerm,
        user: user,
        timeZone: timeZone,
      };

      let totalAmount;
      if (showTotal) {
        totalAmount = await this.getCashAndUpiTotalAmount(filterParams);
      }
      // Get Order image list and count
      const invoice = await InvoiceModel.findAndCountAll(query);

      // Return product image is null
      if (invoice.count === 0) {
        return [];
      }
      let accountArray = [];

      let userArray = [];

      let customerDetails = await account.findAll({
        where: { company_id: companyId },
        attributes: ["name", "id"],
      });

      if (customerDetails && customerDetails.length > 0) {
        for (let i = 0; i < customerDetails.length; i++) {
          accountArray.push({
            name: customerDetails[i].name,
            id: customerDetails[i].id,
          });
        }
      }

      let userDetails = await User.findAll({
        where: { company_id: companyId },
        attributes: ["last_name", "name", "media_url", "id"],
      });

      if (userDetails && userDetails.length > 0) {
        for (let i = 0; i < userDetails.length; i++) {
          userArray.push({
            name: userDetails[i].name,
            last_name: userDetails[i].last_name,
            id: userDetails[i].id,
            media_url: userDetails[i].media_url,
          });
        }
      }
      const orderData = [];
      const saleInvoiceRows = invoice.rows; // Store the rows in a separate variable for better performance

      let customerData = "";
      let userData = "";
      const dateTime = new DateTime();

      for (let i = 0; i < saleInvoiceRows.length; i++) {
        let salesExecutiveName = "";

        if (saleInvoiceRows[i] && saleInvoiceRows[i].salesExecutive) {
          salesExecutiveName =
            saleInvoiceRows[i].salesExecutive.name +
            " " +
            saleInvoiceRows[i].salesExecutive.last_name;
        }
        const invoiceDetail = { ...saleInvoiceRows[i].get() };
        customerData = accountArray.find(
          (value) => value.id == invoiceDetail.customer_account
        );

        userData = userArray.find(
          (value) => value.id == invoiceDetail.delivery_executive
        );
        (invoiceDetail.createdAt = saleInvoiceRows[i].createdAt),
          dateTime.formats.shortDateAndTime;
        (invoiceDetail.updatedAt = saleInvoiceRows[i].updatedAt),
          dateTime.formats.shortDateAndTime;
        (invoiceDetail.date = DateTime.getDateTimeByUserProfileTimezone(invoiceDetail.date,timeZone)),
         
        invoiceDetail.total_amount = invoiceDetail.total_amount;
        invoiceDetail.customer_account =
          invoiceDetail && invoiceDetail.customer_account;
        invoiceDetail.invoice_number =
          invoiceDetail.invoice_number;
        invoiceDetail.order_id = invoiceDetail.order_id;
        invoiceDetail.status =
          saleInvoiceRows[i].statusDetail &&
          saleInvoiceRows[i].statusDetail?.name;
        invoiceDetail.colorCode =
          saleInvoiceRows[i].statusDetail?.color_code;
        invoiceDetail.statusValue = invoiceDetail.status;
       
        invoiceDetail.delivery_executive =
          invoiceDetail.delivery_executive;
        invoiceDetail.delivery_executive_firstName =
          userData && userData.name;
        invoiceDetail.delivery_executive_lastName =
          userData && userData.last_name;
        invoiceDetail.delivery_executive_media_url =
          userData && userData.media_url;
        invoiceDetail.createdBy = invoiceDetail?.user?.name;
        invoiceDetail.locationName = invoiceDetail.location?.name;
        invoiceDetail.salesExecutive = salesExecutiveName;
        invoiceDetail.payment_type =
          invoiceDetail.payment_type == null
            ? ""
            : invoiceDetail.payment_type == Order.PAYMENT_TYPE_UPI_VALUE
            ? Order.PAYMENT_TYPE_UPI_TEXT
            : invoiceDetail.payment_type == Order.PAYMENT_TYPE_CASH_VALUE
            ? Order.PAYMENT_TYPE_CASH_TEXT
            : Order.PAYMENT_TYPE_MIXED_TEXT;
        invoiceDetail.paymentType =
          invoiceDetail.payment_type == null
            ? ""
            : invoiceDetail.payment_type == Order.PAYMENT_TYPE_UPI_TEXT
            ? Order.PAYMENT_TYPE_UPI_VALUE
            : invoiceDetail.payment_type == Order.PAYMENT_TYPE_CASH_TEXT
            ? Order.PAYMENT_TYPE_CASH_VALUE
            : Order.PAYMENT_TYPE_MIXED_VALUE;
        invoiceDetail.customerName = customerData && customerData?.name;
        invoiceDetail.shift =
          invoiceDetail.shiftDetail && invoiceDetail.shiftDetail.name;
        (invoiceDetail.salesExecutiveFirstName =
          saleInvoiceRows[i].salesExecutive?.name),
          (invoiceDetail.salesExecutiveSecondName =
            saleInvoiceRows[i].salesExecutive?.last_name),
          (invoiceDetail.salesExecutiveMediaUrl =
            saleInvoiceRows[i].salesExecutive?.media_url),
          (invoiceDetail.total_cgst_amount =
            invoiceDetail.total_cgst_amount);
        invoiceDetail.total_sgst_amount =
          invoiceDetail.total_sgst_amount;
        invoiceDetail.cash_amount = invoiceDetail.cash_amount;
        invoiceDetail.upi_amount = invoiceDetail.upi_amount;
        invoiceDetail.type =
          invoiceDetail.type == null
            ? ""
            : invoiceDetail.type == Order.TYPE_STORE
            ? Order.TYPE_STORE_TEXT
            : invoiceDetail.type == Order.TYPE_ONLINE
            ? Order.TYPE_ONLINE_TEXT
            : invoiceDetail.type == Order.TYPE_DELIVERY
            ? Order.TYPE_DELIVERY_TEXT
            : invoiceDetail.type == Order.TYPE_CREDIT
            ? Order.TYPE_CREDIT_TEXT
            : "";
        orderData.push(invoiceDetail);
      }

      if(showTotal){
        let lastReCord = ObjectHelper.createEmptyRecord(orderData[0]) 
        lastReCord.total_amount = totalAmount && totalAmount?.totalAmount || "";
        lastReCord.upi_amount = totalAmount && totalAmount?.totalUpiAmount || "";
        lastReCord.cash_amount = totalAmount && totalAmount?.totalCashAmount || "";
        orderData .push(lastReCord);
      }

      let responseData = {
        totalCount: invoice.count,
        currentPage: page,
        pageSize,
        data: orderData,
        sort,
        sortDir,
        search,
      };

      return responseData;
    } catch (err) {
      console.log(err);
    }
  }
  static async getCashAndUpiTotalAmount(params) {
    let whereClause = "";

    if (params?.startDate) {
      whereClause += ` AND "invoice"."date" >= '${DateTime.toGMT(
        params?.startDate,
        params.timeZone
      )}'`;
    }

    if (params?.endDate) {
      whereClause += ` AND "invoice"."date" <= '${DateTime.toGMT(
        params?.endDate,
        params.timeZone
      )}'`;
    }

    if (params?.location) {
      whereClause += ` AND "invoice"."store_id" = ${params?.location}`;
    }

    if (params?.status) {
      whereClause += ` AND "invoice"."status" = ${params?.status}`;
    }

    if (params?.shift) {
      whereClause += ` AND "invoice"."shift" = ${params?.shift}`;
    }

    if (params?.paymentType) {
      whereClause += ` AND "invoice"."payment_type" = ${params?.paymentType}`;
    }

    if (params?.type) {
      whereClause += ` AND "invoice"."type" = ${params?.type}`;
    }

    if (params?.user) {
      whereClause += ` AND "invoice"."sales_executive_user_id" = ${params?.user}`;
    }

    if (params?.searchTerm && isNaN(parseFloat(params?.searchTerm))) {
      whereClause += ` AND ("store"."name" ILIKE '%${params?.searchTerm}%' OR "invoice"."invoice_number" ILIKE '%${params?.searchTerm}%')`;
    }

    if (
      params?.searchTerm &&
      typeof parseFloat(params?.searchTerm) == "number" &&
      !isNaN(parseFloat(params?.searchTerm))
    ) {
      whereClause += ` AND "invoice"."invoice_number" = ${params?.searchTerm}`;
    }

    const rawQuery = `
        SELECT COALESCE(SUM("invoice"."total_amount"), 0) AS "totalAmount",
               COALESCE(SUM("invoice"."cash_amount"), 0) AS "totalCashAmount",
               COALESCE(SUM("invoice"."upi_amount"), 0) AS "totalUpiAmount"
        FROM "invoice"
        LEFT JOIN "user" ON "invoice"."sales_executive_user_id" = "user"."id"
        LEFT JOIN "store" ON "invoice"."store_id" = "store"."id"
        WHERE "invoice"."company_id" = ${params?.companyId}
        AND "invoice"."deletedAt" IS NULL
        ${whereClause}
        ;`;

    const totalAmountResult = await db.connection.query(rawQuery, {
      type: QueryTypes.SELECT,
    });

    return {
      totalAmount: totalAmountResult && totalAmountResult[0]?.totalAmount,
      totalCashAmount:
        totalAmountResult && totalAmountResult[0]?.totalCashAmount,
      totalUpiAmount: totalAmountResult && totalAmountResult[0]?.totalUpiAmount,
    };
  }
  static async createRefund(params,res) {

    let{orderId,selectedIds,companyId} = params
    try {
      const orderDetail = await InvoiceModel.findOne({
        where: { order_id: orderId, company_id: companyId },
      });

      if (orderDetail) {
        let dataObject = {
          invoice_number: orderDetail && orderDetail?.invoice_number,
          date: orderDetail && orderDetail?.date,
          order_id: orderDetail && orderDetail?.order_id,
          store_id: orderDetail && orderDetail?.store_id,
          company_id: orderDetail && orderDetail?.company_id,
          customer_account: orderDetail && orderDetail?.customer_account,
          status: orderDetail && orderDetail?.status,
          sales_executive_user_id:
            orderDetail && orderDetail?.owner,
          delivery_executive: orderDetail && orderDetail?.delivery_executive,
          shift: orderDetail && orderDetail?.shift,
          type: Order.TYPE_CREDIT,
          customer_phone_number:
            orderDetail && orderDetail?.customer_phone_number,
          uuid: orderDetail && orderDetail?.uuid,
          payment_type: orderDetail && orderDetail?.payment_type,
          createdBy: orderDetail && orderDetail?.createdBy,
          total_sgst_amount: orderDetail && orderDetail?.total_sgst_amount,
          total_cgst_amount: orderDetail && orderDetail?.total_cgst_amount,
          cancelled_at: orderDetail && orderDetail?.cancelled_at,
        };

        let saleInvoiceData = await InvoiceModel.create(dataObject);

        if (saleInvoiceData && saleInvoiceData?.id) {
          const orderProductDetail = await ProductInvoiceModel.findAll({
            where: { order_product_id: selectedIds, company_id: companyId },
          });

          const totalAmount = orderProductDetail.reduce((sum, item) => sum + Number.GetFloat(item.price), 0);
          if (orderProductDetail && orderProductDetail.length > 0) {
            for (let i = 0; i < orderProductDetail.length; i++) {
              let objectData = {
                invoice_id: saleInvoiceData?.id,
                product_id:
                  orderProductDetail[i] && orderProductDetail[i].product_id,
                  order_product_id:
                  orderProductDetail[i] && orderProductDetail[i].order_product_id,
                quantity:
                  orderProductDetail[i] && orderProductDetail[i].quantity,
                store_id:
                  orderProductDetail[i] && orderProductDetail[i].store_id,
                status: orderProductDetail[i] && orderProductDetail[i].status,
                price: orderProductDetail[i] && orderProductDetail[i].price,
                unit_price:
                  orderProductDetail[i] && orderProductDetail[i].unit_price,
                company_id:
                  orderProductDetail[i] && orderProductDetail[i].company_id,
                invoice_date:
                  orderProductDetail[i] && orderProductDetail[i].invoice_date,
                cost_price:
                  orderProductDetail[i] && orderProductDetail[i].cost_price,
                profit_amount:
                  orderProductDetail[i] && orderProductDetail[i].profit_amount,
                mrp: orderProductDetail[i] && orderProductDetail[i].mrp,
                cgst_percentage:
                  orderProductDetail[i] &&
                  orderProductDetail[i].cgst_percentage,
                cgst_amount:
                  orderProductDetail[i] && orderProductDetail[i].cgst_amount,
                sgst_percentage:
                  orderProductDetail[i] &&
                  orderProductDetail[i].sgst_percentage,
                sgst_amount:
                  orderProductDetail[i] && orderProductDetail[i].sgst_amount,
                taxable_amount:
                  orderProductDetail[i] && orderProductDetail[i].taxable_amount,
                invoice_number:
                  orderProductDetail[i] && orderProductDetail[i].invoice_number,
                cancelled_at:
                  orderProductDetail[i] && orderProductDetail[i].cancelled_at,
                reward:
                  orderProductDetail[i] && orderProductDetail[i].reward,
                manual_price:
                  orderProductDetail[i] && orderProductDetail[i].manual_price,
              };
              await ProductInvoiceModel.create(objectData);
            }
          }
          let updateData={}
          updateData.total_amount = totalAmount
          if(orderDetail && orderDetail.payment_type == Order.PAYMENT_TYPE_CASH_VALUE){
            updateData.cash_amount = totalAmount
          }
          if(orderDetail && orderDetail.payment_type == Order.PAYMENT_TYPE_UPI_VALUE){
            updateData.upi_amount = totalAmount
          }
           await InvoiceModel.update(updateData,{where:{id:saleInvoiceData?.id}});
           if (!accountSid) {
            throw { message: "ACCOUNT_SID  is required " };
          }
    
          let accountData = await account.findOne({where:{id:orderDetail?.customer_account}})
          if(accountData && accountData?.mobile){
            const messageBody = `Dear Customer, your refund request has been received. The amount of ${Currency.GetFormattedCurrency(totalAmount)} will be refunded to your account within 24 hours.`;
         await WhatsAppService.sendMessage(messageBody,accountData?.mobile)
        }
       
      }
    }
      let statusDetail = await statusService.getData(orderDetail?.status, companyId);

      if(statusDetail && statusDetail?.default_reviewer){
        let getSlackId = await UserService.getSlack(statusDetail?.default_reviewer, companyId);
  
        if (getSlackId) {
          const text = unescape(
            `<@${getSlackId?.slack_id}> Refund Request for Invoice ${orderDetail?.id}`
          );
          SlackService.sendMessageToUser(companyId, getSlackId?.slack_id, text);
        }
      }
      res.json(Response.OK, {
        message: 'Refund Request Created',
    });
    } catch (err) {
      console.log(err);
    }
  }

}





module.exports = InvoiceService;
