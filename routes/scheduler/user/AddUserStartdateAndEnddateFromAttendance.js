const ObjectName = require("../../../helpers/ObjectName");
const Status = require("../../../helpers/Status");
const DataBaseService = require("../../../lib/dataBaseService");
const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const UserService = require("../../../services/UserService");
const schedulerJobCompanyService = require("../schedularEndAt");
const {
  SchedulerJob,
  User: UserModal,
  Attendance,
} = require("../../../db").models;
const userService = new DataBaseService(UserModal);
const User = require("../../../helpers/User");

module.exports = async (req, res) => {
  const company_id = Request.GetCompanyId(req);
  let id = req.query.id;
  let currentDate = new Date();

  try {
    // Fetch schedularData
    const schedularData = await SchedulerJob.findOne({
      where: { id: id, company_id: company_id },
    });

    if (!schedularData) {
      throw new Error("Scheduler job not found");
    }

    let params = {
      companyId: company_id,
      id: id,
      currentDate: currentDate,
      schedularData,
    };

    res.send(200, { message: "Job started" });
    res.on("finish", async () => {
      History.create(
        `${schedularData.name} Job Started`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw err;
        }
      });

      let userList = await userService.find({
        where: {
          company_id: company_id,
          status: [User.STATUS_ACTIVE, User.STATUS_INACTIVE],
        },
      });

      if (userList && userList.length > 0) {
        for (let i = 0; i < userList.length; i++) {
          const { id: user_id, status } = userList[i];

          let attendanceDetails = await Attendance.findOne({
            where: { company_id: company_id, user_id: user_id },
            order: [["date", "ASC"]],
          });

          if (attendanceDetails) {
            const { date: startDate } = attendanceDetails;

            if (status === User.STATUS_ACTIVE) {
              try {
                await UserService.AddStartdateAndEnddateFromAttendance(
                  startDate,
                  null,
                  user_id,
                  company_id
                );
              } catch (error) {
                console.error(`Error reindexing user ${user_id}:`, error);
              }
            } else if (status === User.STATUS_INACTIVE) {
              let attendanceDetail = await Attendance.findOne({
                where: { company_id: company_id, user_id: user_id },
                order: [["date", "DESC"]],
              });

              const { date: endDate } = attendanceDetail;
              try {
                await UserService.AddStartdateAndEnddateFromAttendance(
                  startDate,
                  endDate,
                  user_id,
                  company_id
                );
              } catch (error) {
                console.error(`Error reindexing user ${user_id}:`, error);
              }
            }
          }
        }
      }

      await schedulerJobCompanyService.setStatusCompleted(
        { companyId: company_id, id: id },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      History.create(
        `${schedularData?.name} Job Completed`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
