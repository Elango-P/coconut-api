const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Get Account Entries list", () => {
  const req = {
    query: {},
    isAdmin: true,
    isManager: true,
  };
  const res = {};
  let next;

  const AccountEntry = {
    findAndCountAll: sinon.stub(),
  };

  const list = proxyquire("../../../routes/accountEntry/list", {
    "../../db": {
      models: { AccountEntry },
    },
  });

  const accountEntryData = [
    {
      id: 1,
      date: "2017-11-20T12:32:12.000Z",
      type: "debit",
      categoryId: 1,
      categoryName: "lunch",
      payeeId: 1,
      payeeName: "Junior Kuppanna",
      paymentMode: "cheque",
      invoiceNumber: "1234567890",
      invoiceDate: "2017-11-20T23:32:12.000Z",
      invoiceAmount: 500,
      sgstAmount: 80,
      cgstAmount: 60,
      tdsAmount: null,
      payableAmount: 360,
      notes: "Team lunch",
      attachments: null,
      createdAt: "2017-11-20T13:47:46.000Z",
      updatedAt: "2017-11-20T13:47:46.000Z",
    },
  ];

  function verifyJsonWithPagination(json) {
    expect(json.count).to.be.equal(1);
    expect(json.currentPage).to.be.equal(1);
    expect(json.lastPage).to.be.equal(1);
    expect(json.accountEntries instanceof Array).to.be.true;
  }

  it("should list the account entries", (done) => {
    req.query = {
      pagination: "true",
    };

    AccountEntry.findAndCountAll
      .withArgs({
        where: {},
        limit: 20,
        offset: 0,
        order: [["id", "DESC"]],
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by account entry id", (done) => {
    req.query = { pagination: "true", sortby: "id" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["id", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by date", (done) => {
    req.query = { pagination: "true", sortby: "date" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["date", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by type", (done) => {
    req.query = { pagination: "true", sortby: "type" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["type", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by category id", (done) => {
    req.query = { pagination: "true", sortby: "categoryId" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["category_id", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by category name", (done) => {
    req.query = { pagination: "true", sortby: "categoryName" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["category_name", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by payee id", (done) => {
    req.query = { pagination: "true", sortby: "payeeId" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["payee_id", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by payee name", (done) => {
    req.query = { pagination: "true", sortby: "payeeName" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["payee_name", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of payment", (done) => {
    req.query = { pagination: "true", sortby: "paymentMode" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["mode_of_payment", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of invoice number", (done) => {
    req.query = { pagination: "true", sortby: "invoiceNumber" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["invoice_number", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of invoice amount", (done) => {
    req.query = { pagination: "true", sortby: "invoiceAmount" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["invoice_amount", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of sgst amount", (done) => {
    req.query = { pagination: "true", sortby: "sgstAmount" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["sgst_amount", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of cgst amount", (done) => {
    req.query = { pagination: "true", sortby: "cgstAmount" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["cgst_amount", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of tds amount", (done) => {
    req.query = { pagination: "true", sortby: "tdsAmount" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["tds_amount", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of payable amount", (done) => {
    req.query = { pagination: "true", sortby: "payableAmount" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["payable_amount", "DESC"]],

        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  it("should sort account entries by mode of notes", (done) => {
    req.query = { pagination: "true", sortby: "notes" };

    AccountEntry.findAndCountAll
      .withArgs({
        limit: 20,
        offset: 0,
        order: [["notes", "DESC"]],
        where: {},
      })
      .resolves({
        rows: [{ get: sinon.stub().returns(accountEntryData) }],
        count: 1,
      });

    res.json = (json) => {
      verifyJsonWithPagination(json);
      done();
    };

    list(req, res, next);
  });

  afterEach(() => {
    AccountEntry.findAndCountAll.reset();
  });
});
