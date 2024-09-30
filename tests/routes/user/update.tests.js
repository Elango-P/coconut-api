const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("User - Update", () => {

	const User = { update: sinon.stub(), findById: sinon.stub() };
	const req = { user: { id: 1 }, log: { error: sinon.stub() } };
	const res = {};
	let next;

	const updateUser = proxyquire("../../../routes/user/update", {
		"../../db": {
			models: { User },
			services: {
				Activity: { createActivity: sinon.stub().yields(null) }
			}
		}
	});

	it("should update a user", (done) => {
		req.body = { id: 1, name: "Test", role: 1, active: 1, email: "test@thidiff.com", availableLeaveBalance: 0 };

		User.update.resolves(1);
		User.update.resolves(1);
		User.findById.resolves(1);

		res.json = (json) => {
			expect(json.message).to.be.equal("Profile updated");
			done();
		};

		updateUser(req, res, next);
	});

	afterEach(() => {
		User.update.reset();
	});
});
