const { Attendance } = require("../../db").models;
const DateTime = require("../../lib/dateTime");
const ObjectName = require("../../helpers/ObjectName");
const History = require("../../services/HistoryService");
const Request = require("../../lib/request");
const UserService = require("../../services/UserService");
const companyService = require("../../services/CompanyService");
const SlackService = require("../../services/SlackService");

async function EarlyCheckout(req, res) {
    try {
        const { attendanceId, allowEarlyCheckout } = req.body;
        const companyId = Request.GetCompanyId(req);
        const roleId = Request.getUserRole(req);

        const attendanceDetail = await Attendance.findOne({
            where: { id: attendanceId, company_id: companyId },
        });

        let companyDetail = await companyService.getCompanyDetailById(companyId);

        let ownerId = attendanceDetail.user_id;

        const attendanceDate = DateTime.shortMonthDate(attendanceDetail.date); // Make sure DateTime is properly defined

        if (!attendanceDetail) {
            return res.status(400).json({ message: "Attendance Not Found" });
        }

        let updateData = {};

        if (allowEarlyCheckout) {
            updateData.allow_early_checkout = true;
        }

        // Update the attendance record
        await Attendance.update(updateData, { where: { id: attendanceId, company_id: companyId } });

        res.json(200, { message: "Successfully Early Checkout Updated" });

        res.on("finish", async () => {
            // Check if allow_early_checkout changed from false to true
            if (allowEarlyCheckout) {
                // Code for sending a Slack message for early checkout
                const params = {
                    id: attendanceId,
                    companyId: companyId,
                    companyDetail: companyDetail, // Define companyDetail
                    ownerId: ownerId, // Define ownerId
                    attendanceDate: attendanceDate
                };
                await sendEarlyCheckoutSlackNotification(params);
            }
            // Create a system log for attendance update
            History.create("Early Checkout Updated", req, ObjectName.ATTENDANCE, attendanceId);
        });
    } catch (err) {
        console.log(err);
        return res.json(400, { message: err.message });
    }
}

// Define the sendEarlyCheckoutSlackNotification function outside of the update function
async function sendEarlyCheckoutSlackNotification(params) {
    let { companyId, ownerId, attendanceDate } = params;

    try {
        const getSlackId = await UserService.getSlack(ownerId, companyId);

        if (getSlackId) {
            const text = `<@${getSlackId?.slack_id}> Your ${attendanceDate} Attendance is Allowed for Early Checkout`;
            SlackService.sendMessageToUser(companyId, getSlackId?.slack_id, text);
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = EarlyCheckout;
