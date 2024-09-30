const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Account Entry - Delete", () => {

	const id = 1;
	const req = {
		isAdmin: true,
		params: { id },
	};
	const res = {};
	let next;

	const AccountEntry = { findById: sinon.stub(), destroy: sinon.stub() };

	const del = proxyquire("../../../routes/accountEntry/del", {
		"../../db": {
			models: { AccountEntry }
		}
	});

	it("Should Delete a account entry", (done) => {

		AccountEntry.findById.resolves({ destroy: sinon.stub().resolves(null) });

		res.json = (json) => {
			expect(json.message).to.be.equal("Account Entry Deleted");
			done();
		};

		del(req, res, next);
	});

	it("should return a error if account entry not found", (done) => {
		AccountEntry.findById.resolves(null);

		next = (error) => {
			expect(error.message).to.be.equal("Account Entry not found");
			expect(error.statusCode).to.be.equal(404);
			done();
		};

		del(req, res, next);
	});

	it("should return Bad Request Error when the account entry is empty", (done) => {
		req.params = { id: "" };

		next = (error) => {
			expect(error.message).to.be.equal("Account Entry id is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		del(req, res, next);
	});

	it("should return Bad Request Error when the account entry id is invalid", (done) => {
		req.params = { id: "test" };

		next = (error) => {
			expect(error.message).to.be.equal("Invalid Account Entry id");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		del(req, res, next);
	});

	afterEach(() => {
		AccountEntry.findById.reset();
		AccountEntry.destroy.reset();
	});

});
