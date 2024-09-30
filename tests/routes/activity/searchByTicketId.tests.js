const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

const DateTime = require("../../../lib/dateTime");

const dateTime = new DateTime();

describe("Activity - SearchByTicket", () => {

	const req = { user: { id: 1 }, query: {} };
	const res = {};
	let next;

	const Activity = { findAll: sinon.stub() };

	const list = proxyquire("../../../routes/activity/searchByTicketId", {
		"../../db": { models: { Activity } }
	});

	req.params = { ticketId: 1 };

	const userData = { name: "Test" };

	const activityData = {
		id: 1,
		actual_hours: 1,
		date: "2017-02-01",
		created_at: "2017-02-01 13:00:00",
		notes: "Ticket notes",
		activity: "Productive",
		user_id: 1,
		user: { get: sinon.stub().returns(userData) },
		status: "Approved"
	};

	const returnData = [
		{
			activityId: activityData.id,
			actualHours: utils.convertMsToHours(activityData.actual_hours),
			actualHoursText: utils.covertToHoursAndMinutes(activityData.actual_hours),
			formattedDate: utils.formatDate(activityData.date, "DD MMM, Y"),
			userName: userData.name,
			notes: activityData.notes,
			activity: activityData.activity,
			canDelete: true,
			status: activityData.status,
			createdAt: utils.formatLocalDate(activityData.created_at, dateTime.formats.frontendDateTime12HoursFormat),
		}
	];

	it("should return activity list", (done) => {
		Activity.findAll.resolves([
			{ get: sinon.stub().returns(activityData) }
		]);

		res.json = (json) => {
			expect(json).to.eql(returnData);
			done();
		};

		list(req, res, next);
	});

	it("should return Bad Request when the tickey id is invalid", (done) => {
		req.params = { ticketId: "TEST" };

		next = (err) => {
			expect(err.message).to.be.equal("Invalid ticket id");
			expect(err.statusCode).to.be.equal(400);
			done();
		};

		list(req, res, next);
	});

	afterEach(() => {
		Activity.findAll.reset();
	});

});
