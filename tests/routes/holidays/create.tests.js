const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Holiday - create", () => {

	const Holiday = { findOne: sinon.stub(), create: sinon.stub() };
	const req = {};
	const res = {};
	let next;

	const createHoliday = proxyquire("../../../routes/holidays/create", {
		"../../db": { models: { Holiday } }
	});

	req.userId = 1;

	it("should create a holiday", (done) => {
		req.body = { date: "2017-2-21", name: "Pongal" };

		Holiday.findOne.resolves(null);
		Holiday.create.resolves({ get: sinon.stub().returns({ id: 1 }) });

		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("Holiday created");
			done();
		};
		createHoliday(req, res, next);
	});

	it("should create a holiday with item already exists", (done) => {
		req.body = { date: "2017-2-22", name: "Pongal" };

		Holiday.findOne.resolves(1);
		Holiday.create.resolves({ get: sinon.stub().returns({ id: 1 }) });

		next = (error) => {
			expect(error.message).to.be.equal("Date already exist");
			expect(error.statusCode).to.be.equal(400);
			done();
		};
		createHoliday(req, res, next);
	});


	it("should return Bad Request Error when the date is required", (done) => {
		req.body = { date: "", name: "Test" };

		next = (error) => {
			expect(error.message).to.be.equal("Date is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		createHoliday(req, res, next);
	});

	it("should return Bad Request Error when the name is required", (done) => {
		req.body = { date: "2017-2-20", name: "" };

		next = (error) => {
			expect(error.message).to.be.equal("Name is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		createHoliday(req, res, next);
	});

	afterEach(() => {
		Holiday.create.reset();
		Holiday.findOne.reset();
	});

});
