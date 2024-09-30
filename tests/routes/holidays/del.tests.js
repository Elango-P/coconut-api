const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Holidays delete", () => {

	const Holiday = { findOne: sinon.stub() };
	const req = {};
	const res = {};
	let next;

	const deleteHoliday = proxyquire("../../../routes/holidays/del", {
		"../../db": { models: { Holiday } }
	});

	it("should delete a holiday", (done) => {
		req.params = { id: 1 };

		Holiday.findOne.resolves({ destroy: sinon.stub().resolves(null) });

		res.json = (json) => {
			expect(json.message).to.be.equal("Holiday deleted");
			done();
		};

		deleteHoliday(req, res, next);
	});

	it("should return Not found when the holiday id doesn't exist", (done) => {
		req.params = { id: 1 };

		Holiday.findOne.resolves(null);

		next = (err) => {
			expect(err.statusCode).to.be.equal(404);
			expect(err.message).to.be.equal("Holiday not found");
			done();
		};

		deleteHoliday(req, res, next);
	});

	it("should return Bad Request Error when the holidayId is invalid", (done) => {
		req.params = { id: "test" };

		next = (error) => {
			expect(error.message).to.be.equal("Invalid holiday");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		deleteHoliday(req, res, next);
	});

	afterEach(() => {
		Holiday.findOne.reset();
	});

});
