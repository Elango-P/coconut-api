const proxyquire = require("proxyquire");
const sinon = require("sinon");
const async = require("async");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("Activity - List", () => {

	const req = { isAdmin: true, user: { id: 1 } };
	const res = {};
	let next;

	const User = { findOne: sinon.stub() };
	const Activity = { findAndCountAll: sinon.stub(), sum: sinon.stub() };

	const list = proxyquire("../../../routes/activity/list", {
		"../../db": { models: { User, Activity } }
	});

	const query = {
		userId: req.user.id,
		fromDate: "2017-02-01",
		toDate: "2017-02-03"
	};

	req.query = query;

	const userData = { name: "Test" };

	const activityData = {
		actualHours: 1,
		date: "2017-02-01",
		userId: req.user.id,
		userName: userData.name,
		notes: "Test"
	};

	const returnData = {
		count: 1,
		currentPage: 1,
		lastPage: 1,
		pageStart: 1,
		pageEnd: 1,
		totalActualHours: 1,
		activities: [Object.assign({}, activityData, {
			date: utils.formatDate(activityData.date),
			formattedDate: utils.formatDate(activityData.date, "DD MMM, Y")
		})]
	};

	it("should return activity list", (done) => {
		User.findOne.resolves({ get: sinon.stub().returns(userData) });
		Activity.findAndCountAll.resolves({
			count: 1,
			rows: [
				{ get: sinon.stub().returns(activityData) }
			]
		});

		Activity.sum.resolves(1);

		res.json = (json) => {
			expect(json).to.eql(returnData);
			done();
		};

		list(req, res, next);
	});

	it("should return NotFoundError when user is invalid", (done) => {
		User.findOne.resolves(null);

		next = (err) => {
			expect(err.message).to.be.equal("User not found");
			expect(err.statusCode).to.be.equal(404);
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
			(cb) => validate("userId", "", "User is required", cb),
			(cb) => validate("page", "invalidFieldName", "Invalid page", cb),
			(cb) => validate("pageSize", "invalidFieldName", "Invalid page size", cb)
		], done);

	});

	afterEach(() => {
		Activity.findAndCountAll.reset();
		User.findOne.reset();
	});

});
