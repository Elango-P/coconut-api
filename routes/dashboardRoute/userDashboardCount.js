const { User, Attendance } = require("../../db").models;
const UserStatus = require('../../helpers/User');
const DateTime = require("../../lib/dateTime");

async function userDashboardCount(req, res) {
    const company_id = req.user && req.user.company_id;
    if (company_id) companyWhere = { company_id };

    try {

        let userCount = await User.count({
            where: { company_id, status: UserStatus.STATUS_ACTIVE },
        });

        let currentDate = DateTime.GetGmtDate(new Date());

        let attendanceCount = await Attendance.count({
            where: { company_id, date: currentDate }
        })

        res.send({
            userCount: userCount,
            attendanceCount: attendanceCount
        });
    } catch (err) {
        console.log(err);
        (err) => res.status(400).send({ message: err.message });
    }
}
module.exports = userDashboardCount;
