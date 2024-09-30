const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory - Delete", () => {

	const req = {};
	const res = {};
	let next;

	const Inventory = { destroy: sinon.stub(), findOne: sinon.stub() };

	const del = proxyquire("../../../routes/inventory/del", {
		"../../db": { models: { Inventory } }
	});

	req.params = { inventoryId: 1 };

	it("should delete a inventory", (done) => {
		Inventory.findOne.resolves({ destroy: sinon.stub().resolves(null) });

		res.json = (json) => {
			expect(json.message).to.be.equal("Inventory deleted");
			done();
		};

		del(req, res, next);
	});

	it("should return Not Found Error if inventory not found", (done) => {
		Inventory.destroy.resolves(0);
		Inventory.findOne.resolves(0);

		next = (err) => {
			expect(err.message).to.be.equal("Inventory not found");
			expect(err.statusCode).to.be.equal(404);
			done();
		};

		del(req, res, next);
	});

	afterEach(() => {
		Inventory.destroy.reset();
	});
});
