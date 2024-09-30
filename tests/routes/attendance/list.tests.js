const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("Attendance - list", () => {

	const req = { isAdmin: false, isManager: false, query: {}, user: { id: 1 }, log: { error: sinon.spy() } };
	const res = {};
	let next;

	const Attendance = { findAndCountAll: sinon.stub(), sum: sinon.stub() };

	const list = proxyquire("../../../routes/attendance/list", {
		"../../db": {
			models: { Attendance }
		}
	});

	const userData = {
		id: 3933,
		user_id: 15,
		user: {
			name: "Test"
		},
		date: "2017-02-01T00:00:00.000Z",
		login: "2017-02-01T09:35:14.000Z",
		logout: "2017-02-01T11:36:14.000Z",
		late_hours: 2114,
		not_worked_hours: 2114,
		productive_hours: 2114,
		non_productive_hours: 2114,
		late_hours_status: 2,
		is_leave: null,
		type: 1,
		notes: null,
		ip_address: "127.0.0.1",
		loss_of_pay: null,
		additional_day: null,
		leave_status: null,
		activity_status: 2,
		productive_cost: "",
		non_productive_cost: "",
		status: 1,
		additional_hours: "",
		worked_hours: "",
		lop_hours: ""
	};

	const returnData = {
		id: 3933,
		userId: 15,
		userName: "Test",
		date: "01-02-2017",
		login: "01-02-2017 3:05 PM",
		logout: "01-02-2017 5:06 PM",
		workedHours: "",
		lateHours: utils.covertToHoursAndMinutes(userData.late_hours),
		notWorkedHours: utils.covertToHoursAndMinutes(userData.not_worked_hours),
		productiveHours: utils.covertToHoursAndMinutes(userData.productive_hours),
		nonProductiveHours: utils.covertToHoursAndMinutes(userData.non_productive_hours),
		notes: null,
		ipAddress: "127.0.0.1",
		type: 1,
		typeText: "Working Day",
		status: 1,
		lateHoursStatus: 2,
		activityStatus: 2,
		productiveCost: "",
		nonProductiveCost: "",
		canUpdate: false,
		additionalHours: userData.additional_hours,
		lopHours: ""
	};

	function verifyJson(json) {
		expect(json.count).to.be.equal(1);
		expect(json.currentPage).to.be.equal(1);
		expect(json.lastPage).to.be.equal(1);
		expect(json.attendance instanceof Array).to.be.true;
		expect(json.attendance).to.eql([returnData]);
	}

	it("should return attendance", (done) => {
		Attendance.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(userData) }],
			count: 1
		});
		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});


	it("should search the attendance by status", (done) => {
		req.query.status = 1;

		Attendance.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(userData) }],
			count: 1
		});

		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});

	it("should search the attendance by user", (done) => {
		req.query.userId = 15;

		Attendance.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(userData) }],
			count: 1
		});

		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});

	it("should search the attendance by date", (done) => {
		req.query.date = "2017-02-01";

		Attendance.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(userData) }],
			count: 1
		});

		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});

	it("should search the attendance by fromdate and todate", (done) => {
		req.query.fromDate = "2017-02-01";
		req.query.toDate = "2017-02-01";

		Attendance.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(userData) }],
			count: 1
		});

		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});

	it("should return Bad Request when the page is not a number", (done) => {
		req.query.page = "a";

		next = (err) => {
			expect(err.message).to.be.equal("Invalid page");
			expect(err.statusCode).to.be.equal(400);
			done();
		};

		list(req, res, next);
	});

	it("should return Bad Request when the page size is not a number", (done) => {
		req.query.pageSize = "a";

		next = (err) => {
			expect(err.message).to.be.equal("Invalid page size");
			expect(err.statusCode).to.be.equal(400);
			done();
		};

		list(req, res, next);
	});

	it("should catch the error and log it", (done) => {
		Attendance.findAndCountAll.rejects(new Error("Attendance Crash!"));

		next = (err) => {
			expect(err.message).to.be.equal("Attendance Crash!");
			expect(req.log.error.calledOnce).to.be.true;
			done();
		};

		list(req, res, next);
	});

	afterEach(() => {
		Attendance.findAndCountAll.reset();
		req.query = {};
		req.log.error.reset();
	});

});
