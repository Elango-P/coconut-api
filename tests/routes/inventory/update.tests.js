const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory - Update", () => {
  const req = { where: { id: 1 }, params: {} };
  const res = {};
  let next;

  const Inventory = { findOne: sinon.stub(), count: sinon.stub() };

  const update = proxyquire("../../../routes/inventory/update", {
    "../../db": {
      models: { Inventory },
    },
  });

  const body = {
    name: "lenovo",
    category: "laptop",
    deviceId: "036",
    tags: "lap",
  };

  req.params.inventoryId = 1;

  it("should update a inventory", (done) => {
    req.body = body;
    Inventory.count.resolves(null);
    Inventory.findOne.resolves({
      update: sinon.stub().resolves({
        get: sinon.stub().resolves({ id: 1 }),
      }),
    });

    res.json = (json) => {
      expect(json.message).to.be.equal("Inventory updated");
      done();
    };
    update(req, res, next);
  });

  it("should return inventory not found", (done) => {
    Inventory.findOne.resolves(null);

    next = (err) => {
      expect(err.message).to.be.equal("Inventory not found");
      expect(err.statusCode).to.be.equal(404);
    };

    update(req, res, next);
    done();
  });

  afterEach(() => {
    Inventory.findOne.reset();
  });
});
