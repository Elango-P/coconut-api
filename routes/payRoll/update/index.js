const verifyToken = require("../../../middleware/verifyToken");
const panNumber = require("./panNumber");
const ctc = require("./ctc");
const currentMonthSalary = require("./currentMonthSalary");
const workingDays = require("./workingDays");
const workedDays = require("./workedDays");
const paidLeaves = require("./paidLeaves");
const unpaidLeaves = require("./unpaidLeaves");
const month = require("./month");

module.exports = (server) => {
	server.put("/payroll/update/v1/panNumber/:id", verifyToken, panNumber);
	server.put("/payroll/update/v1/ctc/:id", verifyToken, ctc);
	server.put("/payroll/update/v1/currentMonthSalary/:id", verifyToken, currentMonthSalary);
	server.put("/payroll/update/v1/workingDays/:id", verifyToken, workingDays);
	server.put("/payroll/update/v1/workedDays/:id", verifyToken, workedDays);
	server.put("/payroll/update/v1/paidLeaves/:id", verifyToken, paidLeaves);
	server.put("/payroll/update/v1/unpaidLeaves/:id", verifyToken, unpaidLeaves);
	server.put("/payroll/update/v1/month/:id", verifyToken, month);
};

