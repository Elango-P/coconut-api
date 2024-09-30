const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory Specification - Create", () => {
	const req = {};
	const res = {};
	let next;

	const Inventory = { findOne: sinon.stub() };
	const InventorySpecification = { create: sinon.stub() };

	const create = proxyquire("../../../routes/inventorySpecification/create", {
		"../../db": {
			models: { Inventory, InventorySpecification }
		}
	});

	const body = {
		inventoryId: 1,
		specificationName: "Test",
		description: "Test Description"
	};
	it("should create a inventory specification", (done) => {
		req.body = body;
		Inventory.findOne.resolves(1);
		InventorySpecification.create.resolves({ get: sinon.stub().resolves({ id: 1 }) });

		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("Inventory Specification added");
			done();
		};

		create(req, res, next);
	});

	it("should return Bad Request Error when invalid inventory", (done) => {
		req.body = body;
		Inventory.findOne.resolves(0);
		InventorySpecification.create.resolves(0);

		next = (err) => {
			expect(err.message).to.be.equal("Invalid inventory");
			expect(err.statusCode).to.be.equal(400);
			done();
		};

		create(req, res, next);
	});

	afterEach(() => {
		Inventory.findOne.reset();
		InventorySpecification.create.reset();
	});
});
