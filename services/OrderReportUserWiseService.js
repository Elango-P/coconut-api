const { User:userModel, order, orderProduct } = require('../db').models;

// Util
const { shortDateAndTime } = require('../lib/dateTime');

const DateTime = require('../lib/dateTime');
const DataBaseService = require('../lib/dataBaseService');
const UserService = new DataBaseService(userModel);
const orderService = new DataBaseService(order);
const orderProductService = new DataBaseService(orderProduct);
const { Op } = require('sequelize');
const OrderProductConstants = require('../helpers/OrderProduct');
const User = require('../helpers/User');

const searchUser = async (params, companyId) => {
  try {
  let { shift, startDate, endDate, paymentType } = params;

  let where = {};
  where.company_id = companyId;
  where.status =User.STATUS_ACTIVE;


  const query = {
    where,
    order: [['name', 'ASC']],
  };

  // Get User list and count
  const userDetails = await UserService.findAndCount(query);
  const userData = [];

  for (let userDetail of userDetails.rows) {
    const { id, name, status } =
      userDetail;

    let orderWhere = {};
    if (startDate && !endDate) {
      orderWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      orderWhere.date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }

    if (startDate && endDate) {
      orderWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }
    orderWhere.owner = id;
    if (paymentType) {
      orderWhere.payment_type = paymentType;
    }

    if (shift) orderWhere.shift = shift;
    const orderDetails = await orderService.findAndCount({
      where: orderWhere,
    });
    let totalAmount = 0;

    for (let data of orderDetails.rows) {
      let orderData = {
        ...data.get(),
      };

      totalAmount = totalAmount + Number(orderData.total_amount);
    }
    const data = {
      id,
      name,
      status,
      totalAmount: totalAmount,
    };
    if (status ==User.STATUS_ACTIVE) {
      userData.push(data);
    }
  }
  return {
    totalCount: userDetails.count,
    data: userData,
  };
}catch (err){
  console.log(err);
}
};

const getDataBasedOnType = async (type, orderDetails) => {
  let orderData = [];
  if (type == OrderProductConstants.REPORT_TYPE_MONTH_WISE) {
    await orderDetails.forEach(async (value) => {
      let year = DateTime.getYear(value.date);
      year = String(year).slice(-2);
      let data = {
        amount: Number(value.get('total_amount')),
        date: DateTime.getMonth(value.date) + ' ' + year,
      };
      orderData.push(data);
    });

    orderData = await orderData.reduce((obj, item) => {
      let find = obj.find((i) => i.date === item.date);
      let _d = {
        ...item,
      };
      find ? (find.amount += item.amount) : obj.push(_d);
      return obj;
    }, []);
    return orderData;
  } else if (type ==  OrderProductConstants.REPORT_TYPE_DATE_WISE) {
    orderDetails.forEach((value) => {
      let data = {
        date: DateTime.Format(value.date),
        amount: Number(value.get('total_amount')),
      };
      orderData.push(data);
    });
    orderData = orderData.reduce((obj, item) => {
      let find = obj.find((i) => i.date === item.date);
      let _d = {
        ...item,
      };
      find ? (find.amount += item.amount) : obj.push(_d);
      return obj;
    }, []);
    return orderData;
  }
};



module.exports = {
  searchUser,
  getDataBasedOnType,
};
