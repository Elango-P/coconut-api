const proxyquire = require("proxyquire");
const sinon = require("sinon");
const async = require("async");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("Activity - Search", () => {

	const req = { isAdmin: true, user: { id: 1 } };
	const res = {};
	let next;

	const Activity = { findAll: sinon.stub(), count: sinon.stub(), sum: sinon.stub() };

	const list = proxyquire("../../../routes/activity/search", {
		"../../db": { models: { Activity } },
		"./helpers": { getApprovedActivityIds: sinon.stub().yields(null) }
	});

	const query = {
		userId: req.user.id,
		fromDate: "2017-02-01",
		toDate: "2017-02-03"
	};

	req.query = query;

	const userData = { id: 1, name: "Test" };
	const activityTypeData = { id: 1, name: "Productive", type: "Productive" };
	const ticketData = {
		ticket_id: "TICKET-1",
		project: { get: sinon.stub().returns({ slug: "project" }) }
	};

	const activityData = {
		id: 1,
		actual_hours: 1,
		date: "2017-11-02",
		notes: "Ticket notes",
		activity: "Productive",
		status: "Approved",
		ip_address: "127.0.0.1",
		ticket: { get: sinon.stub().returns(ticketData) },
		user: { get: sinon.stub().returns(userData) },
		activityUsers: { get: sinon.stub().returns(activityTypeData) },
		updated_at: null,
		cost: "salary",
		activityTypeId: "activityTypeId",
		explanation: "Ticket Explanation",
		createdAt: null
	};

	const returnData = {
		count: 1,
		currentPage: 1,
		lastPage: 1,
		pageStart: 1,
		pageEnd: 1,
		totalActualHours: utils.covertToHoursAndMinutes(1),
		activities: [
			{
				activityId: activityData.id,
				actualHours: utils.convertMsToHours(activityData.actual_hours).toFixed(2),
				actualHoursText: utils.covertToHoursAndMinutes(activityData.actual_hours),
				ticketId: ticketData.ticket_id,
				ticketUrl: `/project/${ticketData.ticket_id}`,
				date: utils.formatDate(activityData.date),
				formattedDate: utils.formatDate(activityData.date, "DD MMM, Y"),
				userName: userData.name,
				userId: userData.id,
				notes: activityData.notes,
				activity: "Productive",
				status: "Approved",
				canUpdate: false,
				startDate: null,
				endDate: null,
				ipAddress: activityData.ip_address,
				type: activityTypeData.type,
				updatedAt: activityData.updated_at,
				cost: activityData.cost,
				activityTypeId: activityData.activity_type_id,
				createdAt: activityData.createdAt,
				explanation: "Ticket Explanation",
				canEditNotes: false,
				inCompleteActivityDel: activityData.activity_type_id
			}
		]
	};

	it("should return activity list", (done) => {
		Activity.findAll.resolves([
			{ get: sinon.stub().returns(activityData), sum: sinon.stub() }
		]);

		Activity.count.resolves(1);
		Activity.sum.resolves(1);

		res.json = (json) => {
			expect(json).to.eql(returnData);
			done();
		};

		list(req, res, next);
	});

	it("should return Bad Request when the input is required", (done) => {
		function validate(fieldName, fieldValue, errorMsg, callback) {
			const propertyToDelete = {};
			propertyToDelete[fieldName] = fieldValue;
			req.query = Object.assign({}, query, propertyToDelete);

			next = (err) => {
				expect(err.message).to.be.equal(errorMsg);
				expect(err.statusCode).to.be.equal(400);
				callback();
			};

			list(req, res, next);
		}

		async.series([
			(cb) => validate("page", "invalidFieldName", "Invalid page", cb),
			(cb) => validate("pageSize", "invalidFieldName", "Invalid page size", cb)
		], done);

	});

	afterEach(() => {
		Activity.findAll.reset();
		Activity.count.reset();
	});

});
