const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory - Add", () => {
	const req = {};
	const res = {};
	let next;

	const Inventory = { create: sinon.stub(), findOne: sinon.stub() };

	const create = proxyquire("../../../routes/inventory/add", {
		"../../db": {
			models: { Inventory }
		}
	});

	req.body = {
		name: "iphone",
		category: "iphone6",
		deviceId: 12,
		tags: "iphone"
	};

	it("should add the Inventory", (done) => {
		Inventory.findOne.resolves(0);
		Inventory.create.resolves({ id: 1 });
		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("Invetory added");
			done();
		};

		create(req, res, next);
	});

	afterEach(() => {
		Inventory.create.reset();
	});

});
