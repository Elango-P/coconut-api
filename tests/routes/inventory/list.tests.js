const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Inventory list", () => {
  const req = {
    query: {},
  };
  const res = {};
  let next;

  const Inventory = {
    findAndCountAll: sinon.stub(),
  };

  const list = proxyquire("../../../routes/inventory/list", {
    "../../db": {
      models: { Inventory },
    },
  });

  const returnData = {
    id: 1,
    name: "lenovo",
    category: "laptop",
    deviceId: "036",
    tags: "lap",
  };

  function verifyJson(json) {
    expect(json.count).to.be.equal(1);
    expect(json.currentPage).to.be.equal(1);
    expect(json.lastPage).to.be.equal(1);
    expect(json.inventory instanceof Array).to.be.true;
  }

  it("should list all inventory", (done) => {
    req.query.pageSize = 10;
    req.query.pagination = true;

    Inventory.findAndCountAll.resolves({
      rows: [{ get: sinon.stub().returns(returnData) }],
      count: 1,
    });
    res.json = (json) => {
      verifyJson(json);
    };

    list(req, res, next);
    done();
  });

  it("should search by name", (done) => {
    req.query.name = "Admin";

    Inventory.findAndCountAll.resolves({
      rows: [{ get: sinon.stub().returns(returnData) }],
      count: 1,
    });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort inventory list by id", (done) => {
    req.query = { pagination: "true", sortby: "id" };
    req.query.pageSize = 10;
    req.query.pagination = true;

    Inventory.findAndCountAll
      .withArgs({
        limit: 5,
        order: [["id", "ASC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(returnData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort inventory list by name", (done) => {
    req.query = { pagination: "true", sortby: "name" };

    Inventory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["name", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(returnData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort inventory list by category", (done) => {
    req.query = { pagination: "true", sortby: "category" };

    Inventory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["category", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(returnData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort inventory list by deviceid", (done) => {
    req.query = { pagination: "true", sortby: "deviceId" };

    Inventory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["deviceId", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(returnData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });
  it("should sort inventory list by tags", (done) => {
    req.query = { pagination: "true", sortby: "tags" };

    Inventory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["tags", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(returnData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJson(json);
      done();
    };

    list(req, res, next);
  });

  afterEach(() => {
    Inventory.findAndCountAll.reset();
  });
});
