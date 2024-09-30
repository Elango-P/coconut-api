const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Get Account Categories list", () => {
  const req = {
    query: {},
    isAdmin: true,
    isManager: true,
  };
  const res = {};
  let next;

  const AccountCategory = {
    findAndCountAll: sinon.stub(),
  };

  const list = proxyquire("../../../routes/accountCategory/list", {
    "../../db": {
      models: { AccountCategory },
    },
  });

  const accountCategoryData = [
    {
      id: 1,
      name: "lunch",
      createdAt: "2017-11-20T13:47:46.000Z",
      updatedAt: "2017-11-20T13:47:46.000Z",
    },
  ];

  function verifyJsonWithPagination(json) {
    expect(json.count).to.be.equal(1);
    expect(json.currentPage).to.be.equal(1);
    expect(json.lastPage).to.be.equal(1);
    expect(json.accountCategories instanceof Array).to.be.true;
  }

  it("should list the account categories", (done) => {
    req.query = {
      pagination: "true",
    };

    AccountCategory.findAndCountAll
      .withArgs({
        where: {},
        limit: 20,
        offset: 0,
        order: [["id", "DESC"]],
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountCategoryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account categories by account entry id", (done) => {
    req.query = { pagination: "true", sortby: "id" };

    AccountCategory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["id", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountCategoryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account categories by name", (done) => {
    req.query = { pagination: "true", sortby: "name" };

    AccountCategory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["name", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountCategoryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account categories by created at", (done) => {
    req.query = { pagination: "true", sortby: "createdAt" };

    AccountCategory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["created_at", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountCategoryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account categories by updated at", (done) => {
    req.query = { pagination: "true", sortby: "updatedAt" };

    AccountCategory.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["updated_at", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountCategoryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  afterEach(() => {
    AccountCategory.findAndCountAll.reset();
  });
});
