const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("User - Delete", () => {

	const User = { findOne: sinon.stub() };
	const req = { params: { id: 1 }, log: { error: sinon.stub() } };
	const res = {};
	let next;

	const deleteUser = proxyquire("../../../routes/user/del", {
		"../../db": { models: { User } }
	});

	it("should update a user", (done) => {
		req.body = { active: 1 };

		const userStub = {
			save: sinon.stub().resolves({
				get: sinon.stub().returns({
					active: req.body.active,
				})
			})
		};

		User.findOne.resolves(userStub);

		res.json = (status, json) => {
			expect(status).to.be.equal(200);
			expect(json.message).to.be.equal("User deleted");
			done();
		};

		deleteUser(req, res, next);
	});

	it("should return Not found when the user doesn't exist", (done) => {
		req.params = { id: 1 };

		User.findOne.resolves(null);

		next = (err) => {
			expect(err.statusCode).to.be.equal(404);
			expect(err.message).to.be.equal("User not found");
			done();
		};

		deleteUser(req, res, next);
	});

	afterEach(() => {
		User.findOne.reset();
	});
});
