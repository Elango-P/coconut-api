const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Attendance - Leave", () => {
  const req = {};
  const res = {};
  let next;

  const Attendance = { findOne: sinon.stub(), create: sinon.stub() };
  const Holiday = { findOne: sinon.stub() };
  const User = { findOne: sinon.stub() };

  const leave = proxyquire("../../../routes/attendance/leave", {
    "../../db": {
      models: { Attendance, Holiday, User },
    },
  });

  req.user = { id: 1 };
  req.connection = { remoteAddress: "127.0.0.1" };

  const body = {
    date: "21-02-2017",
    notes: "Test Summary",
    message: "test",
  };

  it("should apply a leave", (done) => {
    req.body = body;

    Attendance.findOne.resolves(null);
    User.findOne.resolves({ get: sinon.stub().resolves({ id: 1 }) });
    Attendance.create.resolves({ get: sinon.stub().resolves({ id: 1 }) });

    res.json = (status, json) => {
      expect(status).to.be.equal(201);
      expect(json.message).to.be.equal("Leave applied");
      done();
    };

    leave(req, res, next);
  });

  it("should update a leave", (done) => {
    req.body = body;

    Attendance.findOne.resolves({
      get: sinon.stub().resolves(1),
      update: sinon.stub().resolves({
        get: sinon.stub().resolves({ id: 1 }),
      }),
    });

    res.json = (status, json) => {
      expect(status).to.be.equal(201);
      expect(json.message).to.be.equal("Leave applied");
      done();
    };

    leave(req, res, next);
  });

  it("should return Bad Request Error when date is holiday", (done) => {
    req.body = body;

    Attendance.findOne.resolves(null);
    User.findOne.resolves(null);
    Holiday.findOne.resolves({
      get: sinon.stub().returns({ name: "Holiday Name" }),
    });

    next = (err) => {
      expect(err.message).to.be.equal("Feb 21, 2017 is Holiday Name");
      expect(err.statusCode).to.be.equal(400);
      done();
    };

    leave(req, res, next);
  });

  it("should return Bad Request Error when date is empty", (done) => {
    req.body = Object.assign({}, body, { date: "" });

    next = (err) => {
      expect(err.message).to.be.equal("Date is required");
      expect(err.statusCode).to.be.equal(400);
      done();
    };

    leave(req, res, next);
  });

  it("should return Bad Request Error when notes is empty", (done) => {
    req.body = Object.assign({}, body, { notes: "" });

    next = (err) => {
      expect(err.message).to.be.equal("Reason is required");
      expect(err.statusCode).to.be.equal(400);
      done();
    };

    leave(req, res, next);
  });

  afterEach(() => {
    Attendance.findOne.reset();
    Holiday.findOne.reset();
    User.findOne.reset();
    Attendance.create.reset();
  });
});
