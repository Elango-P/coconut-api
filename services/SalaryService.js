const { Attendance, User: UserModel, UserEmployment, Holiday, Salary, FineBonus,Shift} = require('../db').models;
const { Op } = require('sequelize');
const DataBaseService = require('../lib/dataBaseService');
const UserEmploymentService = new DataBaseService(UserEmployment);
const String = require('../lib/string');
const Attendances = require('../helpers/Attendance');
const DateTime = require('../lib/dateTime');
const Number = require('../lib/Number');
const salary = require("../helpers/Salary");
const Response = require('../helpers/Response');
const ArrayList = require("../lib/ArrayList");
const { getSettingValueByObject } = require("./SettingService");
const Setting = require("../helpers/Setting");
const ObjectName = require("../helpers/ObjectName");
const Request = require("../lib/request");
const history = require("./HistoryService");
const StatusService = require("./StatusService");
const Status = require("../helpers/Status");
const Currency = require("../lib/currency");
const Month = require("../lib/Month");

class SalaryService {
  static getCalculatedData = async (params) => {
    const { data, companyId, timeZone } = params;

    let SalaryDate = DateTime.getMonthStartEndDates(data.month, data.year, timeZone);

    const user_id = data.user?data.user:data.user_id;
    const endDate = data.endDate?data.endDate:SalaryDate?.endDate;
    const startDate = data.startDate?data.startDate:SalaryDate?.startDate;
    try {

      // Get count based on type
      const getAttendanceCount = async (type) => {
        try {
        let where = {};

        where.company_id = companyId;

          if (user_id) {
            where.user_id = user_id;
          }
          if (startDate && !endDate) {
            where.date = {
              [Op.and]: {
                [Op.gte]: startDate,
              },
            };
          }

          if (endDate && !startDate) {
            where.date = {
              [Op.and]: {
                [Op.lte]: endDate,
              },
            };
          }

          if (startDate && endDate) {
            where.date = {
              [Op.and]: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
              },
            };
          }
          if (type) {
            where.type = type;
          }
          if (type == Attendances.LOGIN) {
            where.login = {
              [Op.ne]: null,
            };
          }

          let attendanceCount = await Attendance.count({ where: where });
          return attendanceCount;
        } catch (err) {
          console.log(err);
        }
      };

      let attendanceCount = await getAttendanceCount()

      if(attendanceCount>0){

      let totalAdditionalMinutes = await Attendance.sum("additional_hours",{
        where:{user_id : user_id,date : {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          }},
          company_id : companyId},
      
      });
      let additional_hours = DateTime.HoursAndMinutes(totalAdditionalMinutes)
      // Get Store list and count
      const userDetail = await UserModel.findOne({
        where: {
          id: user_id,
          company_id: companyId,
        },
      });

  let completeStatus = await StatusService.getAllStatusByGroupId(ObjectName.FINE,Status.GROUP_COMPLETED,companyId)

  let completeStatusIds = completeStatus && completeStatus.length>0 ?completeStatus?.map(value=>value.id):[]

      let fineAmount = await FineBonus.sum('amount', {
        where: {
          user: Number.Get(user_id),
          company_id: companyId,
          status:{[Op.in]:completeStatusIds},
          date: {
            [Op.and]: {
              [Op.gte]: startDate,
              [Op.lte]: endDate,
            },
          },
        },
      });



      const userEmployeeDetails = await UserEmploymentService.findOne({
        where: {
          user_id: user_id,
          company_id: companyId,
        },
      });

      let monthlySalary =  Number.Get(userEmployeeDetails?.salary);

      const attendanceList = [];
      let roleWorkingDays = await getSettingValueByObject(Setting.USER_WORKING_DAYS, companyId, userDetail?.role, ObjectName.ROLE);

      let workingDays = DateTime.getDaysInAMonth(startDate, endDate,roleWorkingDays);
      let holidays;
      let totalWorkingDays;

      if (startDate && endDate) {
        holidays = await Holiday.findAndCountAll({
          where: {
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        });

        totalWorkingDays = workingDays - holidays.count;
      }

      const totalMonths = DateTime.getMonthCount(startDate, endDate);
      

      let salaryPerDay = monthlySalary / totalWorkingDays;

      const additional = await getAttendanceCount(Attendances.TYPE_ADDITIONAL_DAY);

      const login = await getAttendanceCount(Attendances.LOGIN);

      const leave = await getAttendanceCount(Attendances.TYPE_LEAVE);

      const absent = await getAttendanceCount(Attendances.TYPE_ABSENT);

      const worked = await getAttendanceCount(Attendances.TYPE_WORKING_DAY);
      
      const additionalHourAmount = (Number.GetFloat(totalAdditionalMinutes/60)/8)* (salaryPerDay)
      
      let workedDaySalary = Number.Get(worked) * Number.GetFloat(salaryPerDay)

      let hra = Number.GetFloat((workedDaySalary / 2) * 0.5) * Number.GetFloat(totalMonths);

      let basic = Number.GetFloat( workedDaySalary / 2) * Number.GetFloat(totalMonths);

      let standardAllowance = Number.GetFloat(data.standard_allowance) *Number.GetFloat(totalMonths);

      let specialAllowance =  (Number.GetFloat(workedDaySalary - (hra + basic + standardAllowance)));

      let leave_salary =  Number.GetFloat((leave + absent) * salaryPerDay)

      let bonus = Number.GetFloat(data.bonus) * Number.GetFloat(totalMonths);

      let additional_day_allowance = Number.GetFloat(additional) * Number.GetFloat(salaryPerDay);

      let pf = Number.GetFloat(data.provident_fund);

      let pt = Number.GetFloat(data.professional_tax);

      let medical_insurance = Number.GetFloat(data.medical_insurance) * Number.GetFloat(totalMonths);

      let gratuity = Number.GetFloat(data.gratuity)* Number.GetFloat(totalMonths);

      let other_deductions = Number.GetFloat(data.other_deductions) *Number.GetFloat(totalMonths);

      let other_allowance = Number.GetFloat(data.other_allowance) *Number.GetFloat(totalMonths);

      let tds = Number.GetFloat(data.tds) * Number.GetFloat(totalMonths);

      let fine = Number.GetFloat(fineAmount)

      let netSalary =
      Number.GetFloat(basic + hra + standardAllowance + specialAllowance + bonus + additional_day_allowance + additionalHourAmount + other_allowance)  -
      Number.GetFloat(pf + pt + medical_insurance + gratuity + other_deductions + tds + fine);
      attendanceList.push({
        monthlySalary: monthlySalary,
        user: userDetail && userDetail.id,
        additional: additional,
        total: login,
        leave: leave,
        absent: absent,
        worked: worked,
        userName: userDetail && String.concatName(userDetail.name, userDetail.last_name),
        firstName: userDetail && userDetail.name,
        LastName: userDetail && userDetail.last_name,
        avatarUrl: userDetail && userDetail.media_url,
        additional_hours: additional_hours || "",
        startDate: startDate || '',
        endDate: endDate || '',
        totalWorkingDays: totalWorkingDays,
        basic:  basic,
        hra:  hra,
        salaryPerDay:  salaryPerDay,
        leave_salary:  leave_salary,
        bonus:  bonus,
        additional_day_allowance:  additional_day_allowance,
        special_allowance:  specialAllowance,
        net_salary:Number.roundOff(netSalary),
        id:  Number.Get(data.id),
        fine:fine,
        additionalHourAmount:additionalHourAmount,
        totalMinutes:totalAdditionalMinutes || "",
        worked_days_salary:Number.roundOff(workedDaySalary),
        other_allowance:other_allowance,
        data:data
      });

      return attendanceList;
    }
    } catch (err) {
      console.log(err);
    }
  };

  static bulkUpdate = async (params) => {
    let { data, companyId, timeZone } = params;
    try {
      let ids = data.selectedIds;
      data.selectedIds;

      if (!(ids && ids.length > 0)) {
        throw {
          message: "Id required",
        };
      }
      let reCalcuatedArray = [];
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        let salaryDetail = await Salary.findOne({
          where: { id: id, company_id: companyId },
        });
        let param = {
          data: salaryDetail,
          companyId: companyId,
          timeZone: timeZone,
        };
        let response = await this.getCalculatedData(param);
        reCalcuatedArray.push(...response);
      }

      let updateCalculatedData = {};

      for (let i = 0; i < reCalcuatedArray.length; i++) {
        let historyMessage = new Array();
        let value = reCalcuatedArray[i];
        let data = reCalcuatedArray[i].data && reCalcuatedArray[i].data?.dataValues;
        updateCalculatedData.user_id = value.user ? value.user : "";
        updateCalculatedData.working_days = value.totalWorkingDays;
        updateCalculatedData.worked_days = value.worked;
        updateCalculatedData.leave = value.leave;
        updateCalculatedData.absent = value.absent;
        updateCalculatedData.additional_days = value.additional;
        updateCalculatedData.basic = Number.roundOff(value.basic);
        updateCalculatedData.hra = Number.roundOff(value.hra);
        updateCalculatedData.special_allowance = Number.roundOff(
          value.special_allowance
        );
        updateCalculatedData.net_salary = Number.roundOff(value.net_salary);
        updateCalculatedData.monthly_salary = Number.roundOff(
          value.monthlySalary
        );
        updateCalculatedData.additional_day_allowance = Number.roundOff(
          value.additional_day_allowance
        );
        updateCalculatedData.bonus = Number.roundOff(value.bonus);
        updateCalculatedData.salary_per_day = Number.roundOff(
          value.salaryPerDay
        );
        updateCalculatedData.leave_salary = Number.roundOff(value.leave_salary);
        updateCalculatedData.fine = Number.roundOff(value.fine);
        updateCalculatedData.additional_hours = Number.roundOff(
          value.totalMinutes
        );
        updateCalculatedData.additional_hours_salary = Number.roundOff(
          value.additionalHourAmount
        );
        updateCalculatedData.worked_days_salary = Number.roundOff(
          value.worked_days_salary
        );
        updateCalculatedData.other_allowance = Number.roundOff(
          value.other_allowance
        );

        if (Number.Get(data?.working_days) !== Number.Get(updateCalculatedData?.working_days)) {
          historyMessage.push(
            `Working Days changed to ${updateCalculatedData?.working_days}`
          );
        }
        if (Number.Get(data?.worked_days) !== Number.Get(updateCalculatedData?.worked_days)) {
          historyMessage.push(
            `Worked Days changed to ${updateCalculatedData?.worked_days}`
          );
        }
        if (Number.Get(data?.leave) !== Number.Get(updateCalculatedData?.leave)) {
          historyMessage.push(
            `Leave changed to ${updateCalculatedData?.leave}`
          );
        }
        if (Number.Get(data?.absent) !== Number.Get(updateCalculatedData?.absent)) {
          historyMessage.push(
            `Absent changed to ${updateCalculatedData?.absent}`
          );
        }
        if (
          Number.Get(data?.additional_days) !==
          Number.Get(updateCalculatedData?.additional_days)
        ) {
          historyMessage.push(
            `Additional Days changed to ${updateCalculatedData?.additional_days}`
          );
        }
        if (Number.Get(data?.basic) !== Number.Get(updateCalculatedData?.basic)) {
          historyMessage.push(
            `Basic changed to ${Currency.IndianFormat(updateCalculatedData?.basic)}`
          );
        }
        if (Number.Get(data?.hra) != Number.Get(updateCalculatedData?.hra)) {
          historyMessage.push(
            `Hra changed to ${Currency.IndianFormat(updateCalculatedData?.hra)}`
          );
        }
        if (
          Number.Get(data?.special_allowance) !==
          Number.Get(updateCalculatedData?.special_allowance)
        ) {
          historyMessage.push(
            `Special Allowance changed to ${Currency.IndianFormat(updateCalculatedData?.special_allowance)}`
          );
        }
        if (Number.Get(data?.net_salary) !== Number.Get(updateCalculatedData?.net_salary)) {
          historyMessage.push(
            `Net Salary changed to ${Currency.IndianFormat(updateCalculatedData?.net_salary)}`
          );
        }
        if (
          Number.Get(data?.monthly_salary) !== Number.Get(updateCalculatedData?.monthly_salary)
        ) {
          historyMessage.push(
            `Monthly Salary changed to ${Currency.IndianFormat(updateCalculatedData?.monthly_salary)}`
          );
        }
        if (
          Number.Get(data?.additional_day_allowance) !==
          Number.Get(updateCalculatedData?.additional_day_allowance)
        ) {
          historyMessage.push(
            `Additional Aay allowance changed to ${Currency.IndianFormat(updateCalculatedData?.additional_day_allowance)}`
          );
        }
        if (Number.Get(data?.bonus) !== Number.Get(updateCalculatedData?.bonus)) {
          historyMessage.push(
            `Bonus changed to ${Currency.IndianFormat(updateCalculatedData?.bonus)}`
          );
        }
        if (
          Number.Get(data?.salary_per_day) !== Number.Get(updateCalculatedData?.salary_per_day)
        ) {
          historyMessage.push(
            `Salary per day changed to ${Currency.IndianFormat(updateCalculatedData?.salary_per_day)}`
          );
        }
        if (Number.Get(data?.leave_salary) != Number.Get(updateCalculatedData?.leave_salary)) {
          historyMessage.push(
            `Leave salary changed to ${Currency.IndianFormat(updateCalculatedData?.leave_salary)}`
          );
        }
        if (Number.Get(data?.fine) != Number.Get(updateCalculatedData?.fine)) {
          historyMessage.push(
            `Fine changed to ${Currency.IndianFormat(updateCalculatedData?.fine)}`
          );
        }
        if (
          Number.Get(data?.additional_hours) !=
          Number.Get(updateCalculatedData?.additional_hours)
        ) {
          historyMessage.push(
            `Additional Hours changed to ${updateCalculatedData?.additional_hours}`
          );
        }
        if (
          Number.Get(data?.additional_hours_salary) !=
          Number.Get(updateCalculatedData?.additional_hours_salary)
        ) {
          historyMessage.push(
            `Additional Hours Salary changed to ${Currency.IndianFormat(updateCalculatedData?.additional_hours_salary)}`
          );
        }
        if (
          Number.Get(data?.worked_days_salary) !=
          Number.Get(updateCalculatedData?.worked_days_salary)
        ) {
          historyMessage.push(
            `Worked Days Salary changed to ${Currency.IndianFormat(updateCalculatedData?.worked_days_salary)}`
          );
        }
        if (
          Number.Get(data?.other_allowance) != Number.Get(updateCalculatedData?.other_allowance)
        ) {
          historyMessage.push(
            `Other Allowance changed to ${Currency.IndianFormat(updateCalculatedData?.other_allowance)}`
          );
        }

        await Salary.update(updateCalculatedData, {
          where: { id: value.id, company_id: companyId },
        });
        if (historyMessage && historyMessage.length > 0) {
          let message = historyMessage.join();
          history.create(
            `${message}`,
            { user: { id: data?.user_id, company_id: companyId } },
            ObjectName.SALARY,
            data?.id
          );
        }
      }
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  static async bulkDelete(req, res) {
    try {
      const ids = req?.body?.selectedId;
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid IDs provided" });
      }
  
      const company_id = Request.GetCompanyId(req);
  
      for (const id of ids) {
        await Salary.destroy({ where: { id: id, company_id: company_id } });

        await history.create("Salary Deleted", req, ObjectName.SALARY, id);
      }
  
      res.json(200, { message: 'Salary Deleted' });
  
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  }


  static async del(req, res) {
    try {
      const { id } = req.params;

      const company_id = Request.GetCompanyId(req);

      if (!id) {
        return res.json(BAD_REQUEST, { message: "Salary id is required" });
      }
      const salaryDetail = await Salary.findOne({
        where: { id, company_id },
      });
      if (!salaryDetail) {
        return res.json(BAD_REQUEST, { message: "Salary not found" });
      }

      await salaryDetail.destroy();

      res.json(Response.DELETE_SUCCESS, { message: "Salary deleted" });
    } catch (err) {
      console.log(err);    }
  }

  static create = async (data, companyId) => {
    try {
      const getNextSalaryNumber = async (company_id) => {
        let salary_number;
        //get last Salary
        let lastsalary = await Salary.findOne({
          order: [["createdAt", "DESC"]],
          where: { company_id },
        });

        salary_number = lastsalary && lastsalary.salary_number;
        if (!salary_number) {
          salary_number = 1;
        } else {
          salary_number = salary_number + 1;
        }

        return salary_number;
      };
      const userData = await UserModel.findAll({
        where: { company_id: companyId },
        attributes: ["id", "name", "last_name"],
      });

      let SalaryData = new Object();

      let param = {
        data: SalaryData,
        companyId: companyId,
        timeZone: data.timeZone,
      };
      let reCalcuatedArray = [];
      for (let i = 0; i < userData.length; i++) {
        let salaryExist = await Salary.findOne({
          where: {
            user_id: userData[i].id,
            month: data.month,
            year: data.year,
            company_id: companyId,
          },
        });

        if (!salaryExist) {
          SalaryData.user = userData[i].id;

          SalaryData.month = data.month;

          SalaryData.year = data.year;

          let response = await this.getCalculatedData(param);
          if (response) {
            reCalcuatedArray.push(...response);
          }
        }
      }
      let createCalculatedData = {};
      let salaryNumber;
      const status = await StatusService.getFirstStatusDetail(
        ObjectName.SALARY,
        companyId
      );

      for (let i = 0; i < reCalcuatedArray.length; i++) {
        let historyMessage = new Array();

        salaryNumber = await getNextSalaryNumber(companyId);
        createCalculatedData.user_id = reCalcuatedArray[i].user
          ? reCalcuatedArray[i].user
          : "";
        createCalculatedData.working_days =
          reCalcuatedArray[i].totalWorkingDays;
        createCalculatedData.worked_days = reCalcuatedArray[i].worked;
        createCalculatedData.leave = reCalcuatedArray[i].leave;
        createCalculatedData.absent = reCalcuatedArray[i].absent;
        createCalculatedData.additional_days = reCalcuatedArray[i].additional;
        createCalculatedData.basic = Number.roundOff(reCalcuatedArray[i].basic);
        createCalculatedData.hra = Number.roundOff(reCalcuatedArray[i].hra);
        createCalculatedData.special_allowance = Number.roundOff(
          reCalcuatedArray[i].special_allowance
        );
        createCalculatedData.net_salary = Number.roundOff(
          reCalcuatedArray[i].net_salary
        );
        createCalculatedData.monthly_salary = Number.roundOff(
          reCalcuatedArray[i].monthlySalary
        );
        createCalculatedData.additional_day_allowance = Number.roundOff(
          reCalcuatedArray[i].additional_day_allowance
        );
        createCalculatedData.bonus = Number.roundOff(reCalcuatedArray[i].bonus);
        createCalculatedData.salary_per_day = Number.roundOff(
          reCalcuatedArray[i].salaryPerDay
        );
        createCalculatedData.leave_salary = Number.roundOff(
          reCalcuatedArray[i].leave_salary
        );
        createCalculatedData.fine = Number.roundOff(reCalcuatedArray[i].fine);
        createCalculatedData.status = status && status?.id;
        createCalculatedData.company_id = companyId;
        createCalculatedData.salary_number = salaryNumber;
        createCalculatedData.additional_hours = Number.roundOff(
          reCalcuatedArray[i].totalMinutes
        );
        createCalculatedData.additional_hours_salary = Number.roundOff(
          reCalcuatedArray[i].additionalHourAmount
        );
        createCalculatedData.month = Number.Get(data?.month);
        (createCalculatedData.year = Number.Get(data?.year)),
          (createCalculatedData.worked_days_salary = Number.Get(
            reCalcuatedArray[i]?.worked_days_salary
          )),
          (createCalculatedData.other_allowance = Number.Get(
            reCalcuatedArray[i]?.other_allowance
          ));
        let salaryDetail = await Salary.create(createCalculatedData);
        let userDetail = userData.find(
          (value) => value.id == salaryDetail?.user_id
        );
        if (salaryDetail && salaryDetail?.id && userDetail) {
          if (Number.isNotNull(salaryDetail?.user_id)) {
            historyMessage.push(
              `Salary added with user ${String.concatName(
                userDetail?.name,
                userDetail?.last_name
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.salary_number)) {
            historyMessage.push(
              `Salary added with salary number ${salaryDetail?.salary_number}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.month)) {
            historyMessage.push(
              `Salary added with month ${Month.get(salaryDetail?.month)}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.year)) {
            historyMessage.push(
              `Salary added with year ${salaryDetail?.year}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.monthly_salary)) {
            historyMessage.push(
              `Salary added with monthly salary ${Currency.IndianFormat(
                salaryDetail?.monthly_salary
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.working_days)) {
            historyMessage.push(
              `Salary added with working days ${salaryDetail?.working_days}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.worked_days)) {
            historyMessage.push(
              `Salary added with worked days ${salaryDetail?.worked_days}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.basic)) {
            historyMessage.push(
              `Salary added with basic ${Currency.IndianFormat(
                salaryDetail?.basic
              )}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.hra)) {
            historyMessage.push(
              `Salary added with hra ${Currency.IndianFormat(
                salaryDetail?.hra
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.special_allowance)) {
            historyMessage.push(
              `Salary added with special allowance ${Currency.IndianFormat(
                salaryDetail?.special_allowance
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.worked_days_salary)) {
            historyMessage.push(
              `Salary added with worked days salary ${Currency.IndianFormat(
                salaryDetail?.worked_days_salary
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.salary_per_day)) {
            historyMessage.push(
              `Salary added with salary per day ${Currency.IndianFormat(
                salaryDetail?.salary_per_day
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.additional_days)) {
            historyMessage.push(
              `Salary added with additional days ${salaryDetail?.additional_days}\n`
            );
            if (Number.isNotNull(salaryDetail?.additional_days_salary)) {
              historyMessage.push(
                `Salary added with additional days Salary ${Currency.IndianFormat(
                  salaryDetail?.additional_days_salary
                )}\n`
              );
            }
          }
          if (Number.isNotNull(salaryDetail?.leave)) {
            historyMessage.push(
              `Salary added with leave ${salaryDetail?.leave}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.absent)) {
            historyMessage.push(
              `Salary added with absent ${salaryDetail?.absent}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.leave_salary)) {
            historyMessage.push(
              `Salary added with leave salary ${Currency.IndianFormat(
                salaryDetail?.leave_salary
              )}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.additional_day_allowance)) {
            historyMessage.push(
              `Salary added with additional day allowance ${Currency.IndianFormat(
                salaryDetail?.additional_day_allowance
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.additional_hours)) {
            historyMessage.push(
              `Salary added with additional hours ${salaryDetail?.additional_hours}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.additional_hours_salary)) {
            historyMessage.push(
              `Salary added with additional hours salary ${Currency.IndianFormat(
                salaryDetail?.additional_hours_salary
              )}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.other_allowance)) {
            historyMessage.push(
              `Salary added with other allowance ${Currency.IndianFormat(
                salaryDetail?.other_allowance
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.bonus)) {
            historyMessage.push(
              `Salary added with bonus ${Currency.IndianFormat(
                salaryDetail?.bonus
              )}\n`
            );
          }

          if (Number.isNotNull(salaryDetail?.fine)) {
            historyMessage.push(
              `Salary added with fine ${Currency.IndianFormat(
                salaryDetail?.fine
              )}\n`
            );
          }
          if (Number.isNotNull(salaryDetail?.status)) {
            historyMessage.push(`Salary added with status ${status?.name}\n`);
          }

          if (Number.isNotNull(salaryDetail?.net_salary)) {
            historyMessage.push(
              `Salary added with net salary ${Currency.IndianFormat(
                salaryDetail?.net_salary
              )}\n`
            );
          }

          if (historyMessage && historyMessage.length > 0) {
            let message = historyMessage.join();
            history.create(
              `${message}`,
              { user: { id: salaryDetail?.user_id, company_id: companyId } },
              ObjectName.SALARY,
              salaryDetail?.id
            );
          }
        }
      }
      return true;
    } catch (err) {
      
      console.log(err);
      throw err;

    }
  }
  static async projectionReport(params) {
    try {
      let {startDate, endDate,companyId,user,page, pageSize, sort, sortDir ,timeZone} =params

      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page" });
      }
  
      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page size" });
      }

    let where = {};

    if(user){
      where.user_id = user
    }
    where.date = {
      [Op.and]: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };
    
      where.company_id = companyId;

      let attendanceData = await Attendance.findAll({
        where,
        attributes:["id","user_id","additional_hours"],
        include: [
          {
            model: Shift,
            as: 'shift',
            attributes: ['name',"id","start_time","end_time"],
          },
          
        ],
      });

      let userIds = attendanceData && attendanceData.map(value=> value?.user_id)

      let uniqueUserIds = [...new Set(userIds)];

      let SalaryData = new Object();

      let param = {
        data: SalaryData,
        companyId: companyId,
        timeZone:timeZone
      };
        
      let reCalcuatedArray = [];

      if(uniqueUserIds && uniqueUserIds.length>0){
        
      for (let i = 0; i < uniqueUserIds.length; i++) {    
        
        SalaryData.user = uniqueUserIds[i];

        SalaryData.startDate = startDate;

        SalaryData.endDate = endDate;

        let response = await this.getCalculatedData(param);        

        reCalcuatedArray.push(...response);
      }
    }
    let sortParam =""
    if(sort == "additional_hours"){
      sortParam = "totalMinutes"
    }else{
      sortParam= sort
    }

    let data = ArrayList.sort(reCalcuatedArray,sortParam,sortDir)
    const offset = (page - 1) * pageSize;
    const paginatedResults = data.slice(offset, offset + pageSize);
      return {
        paginatedResults,
        totalCount:data.length,
        page,
        pageSize
      }

    } catch (err) {
      console.log(err);    }
  }
}
module.exports = SalaryService;
