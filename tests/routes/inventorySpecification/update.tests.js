const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory Specification - Update", () => {
  const req = { params: {} };
  const res = {};
  let next;

  const InventorySpecification = { findOne: sinon.stub() };

  const update = proxyquire("../../../routes/inventorySpecification/update", {
    "../../db": {
      models: { InventorySpecification },
    },
  });
  req.params.inventorySpecificationId = 1;
  it("should update a inventory specification", (done) => {
    req.body = {
      specificationName: "Test",
      description: "Test Description update",
    };
    InventorySpecification.findOne.resolves({
      update: sinon.stub().resolves(1),
    });

    res.json = (json) => {
      expect(json.message).to.be.equal(
        "Inventory specification updated"
      );
      done();
    };

    update(req, res, next);
  });

  it("should return Not Found Error when Inventory specification not found", (done) => {
    InventorySpecification.findOne.resolves(null);

    next = (err) => {
      expect(err.message).to.be.equal("Inventory specification not found");
      expect(err.statusCode).to.be.equal(404);
      done();
    };

    update(req, res, next);
  });

  it("should return Bad Request Error when description is empty", (done) => {
    req.body.description = "";

    next = (err) => {
      expect(err.message).to.be.equal("Description is required");
      expect(err.statusCode).to.be.equal(400);
      done();
    };

    update(req, res, next);
  });

  afterEach(() => {
    InventorySpecification.findOne.reset();
  });
});
