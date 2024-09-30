const { Op } = require('sequelize');
const { STATUS_ACTIVE } = require('../helpers/Location');
const Request = require('../lib/request');
const ShiftService = require('./ShiftService');
const UserService = require('./UserService');
const DateTime = require('../lib/dateTime');
const String = require('../lib/string');
const { Location, Shift, Attendance, UserIndex, UserEmployment } = require('../db').models;
const mediaService = require("./MediaService");
const Setting = require("../helpers/Setting");
const { getSettingValue } = require("./SettingService");

const search = async (params, companyId, currentDate) => {
  try {
    let userDefaultTimeZone = await getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);
    params.page = params.page ? parseInt(params.page, 10) : 1;
    if (isNaN(params.page)) {
      throw { message: 'Invalid page' };
    }

    // Validate if params.page size is not a number
    params.pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 25;

    if (isNaN(params.pageSize)) {
      throw { message: 'Invalid page size' };
    }
    let where = {};

    where.company_id = companyId;
    where.status = STATUS_ACTIVE;
    const searchTerm = params.search ? params.search.trim() : null;

    if (searchTerm) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }
    const query = {
      order: [['sort_order', 'ASC']],
      where,
    };
    const locationData = await Location.findAndCountAll(query);

    if (locationData.rows && locationData.rows.length == 0) {
      throw { message: 'Locations Not Found' };
    }

    let attendanceWhere = {};

    if (params.shift) {
      attendanceWhere.shift_id = params.shift;
    }
    attendanceWhere.company_id = companyId;

    if (params.date) {
      attendanceWhere.date = params.date;
    }
    if (params.type) {
      attendanceWhere.type = params.type;
    }

    if (currentDate) {
      attendanceWhere.date = currentDate;
    }

    if (params.type) {
      attendanceWhere.type = params.type;
    }

    let attendance = [];
    let location = [];
    if (locationData.rows && locationData.rows.length > 0) {
      for (let i = 0; i < locationData.rows.length; i++) {
        let value = {
          locationName: locationData.rows[i].name,
          locationId: locationData.rows[i].id,
        };
        location.push(value);
      }
    }

    let attendanceData = await Attendance.findAll({
      where: attendanceWhere,
      order: [['login', 'ASC']],
      include: [
        {
          model: Shift,
          as: 'shift',
          attributes: ['name'],
        },
        {
          model: UserIndex,
          as: 'userIndex',
          include: [
            { model: Location, as: 'primaryLocation' },
                { model: Shift, as: 'primaryShift' },
          ],
        },
      ],
    });

    if (attendanceData && attendanceData.length > 0) {
      for (let j = 0; j < attendanceData.length; j++) {
        let userDetail = await UserService.getUserDetailById(attendanceData[j].user_id, companyId);
        let bothLocationMatched = attendanceData[j].userIndex?.primaryLocation?.id === attendanceData[j].store_id;
        let data = {
          name: userDetail?.name,
          last_name: userDetail?.last_name,
          loginTime: currentDate
            ? DateTime.getUserTimeZoneTime(attendanceData[j].login, userDefaultTimeZone)
            : attendanceData[j].login,
          logoutTime: currentDate
            ? DateTime.getUserTimeZoneTime(attendanceData[j].login, userDefaultTimeZone)
            : attendanceData[j].logout,
          type: attendanceData[j].type,
          location_id: attendanceData[j].store_id,
          image: userDetail?.media_url,
          shiftName: attendanceData[j] && attendanceData[j].shift && attendanceData[j].shift.name,
          primaryLocationName: attendanceData[j] && attendanceData[j].userIndex && attendanceData[j].userIndex?.primaryLocation?.name,
          primaryShiftName: attendanceData[j] && attendanceData[j].userIndex && attendanceData[j].userIndex.primaryShift?.name,
          bothLocationMatched: bothLocationMatched,
          attendanceId: attendanceData[j].id,
          media_url: await mediaService.getMediaURL(attendanceData[j].check_in_media_id, companyId),
        };
        attendance.push(data);
      }
    }

    return {
      totalCount: locationData.count,
      currentPage: params.page,
      pageSize: params.pageSize,
      data: {
        attendance,
        location,
      },
    };
  } catch (err) {
    console.log(err);
    throw err
  }
};

module.exports = { search };
