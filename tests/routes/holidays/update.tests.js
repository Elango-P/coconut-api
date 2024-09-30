const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Holiday - Update", () => {

	const Holiday = { findById: sinon.stub() };
	const req = { log: { error: sinon.stub() } };
	const res = {};
	let next;

	const updateConversation = proxyquire("../../../routes/holidays/update", {
		"../../db": { models: { Holiday } }
	});

	it("should update a ticket component", (done) => {
		req.params = { id: 1 };
		req.body = { date: "2017=01-26", name: "Republic day" };

		const holidaysStub = {
			save: sinon.stub().resolves({
				get: sinon.stub().returns({
					holidaysId: 1,
					date: req.body.date,
					name: req.body.name
				})
			})
		};

		Holiday.findById.resolves(holidaysStub);

		res.json = (status, json) => {
			expect(status).to.be.equal(200);
			expect(json.message).to.be.equal("Holiday updated");
			done();
		};

		updateConversation(req, res, next);
	});

	it("should catch the error and call next when an error occurs saving the holiday", (done) => {
		req.body = { name: "Test", sort: 12, status: 1 };

		Holiday.findById.resolves({
			save: sinon.stub().rejects(new Error("Holiday update error"))
		});

		next = (err) => {
			expect(err.message).to.be.equal("Holiday update error");
			done();
		};

		updateConversation(req, res, next);
	});

	it("should return Not found when the holiday doesn't exist", (done) => {
		req.body = { name: "Test", sort: 12, status: 1 };

		Holiday.findById.resolves(null);

		next = (err) => {
			expect(err.statusCode).to.be.equal(404);
			expect(err.message).to.be.equal("Holiday not found");
			done();
		};

		updateConversation(req, res, next);
	});

	it("should return Bad Request Error when the name is required", (done) => {
		req.body = { sort: 12, status: 1 };

		next = (error) => {
			expect(error.message).to.be.equal("Name is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		updateConversation(req, res, next);
	});

	afterEach(() => {
		Holiday.findById.reset();
	});

});
