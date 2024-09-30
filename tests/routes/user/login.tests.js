const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("User - Login", () => {
  const req = { connection: { remoteAddress: "127.0.0.1" } };
  const res = {};
  let next;

  const User = { findOne: sinon.stub() };
  const Attendance = { findOne: sinon.stub() };
  const verifyIdToken = sinon.stub();

  const login = proxyquire("../../../routes/user/login", {
    "../../db": { models: { User, Attendance } },
    "../../services/attendance": {
      createAttendance: sinon.stub().yields(null),
      updateAutoLogout: sinon.stub().yields(null),
    },
    "../systemConfig/get": sinon.stub().yields(null, "127.0.0.1"),
  });

  it("should login", (done) => {
    req.body = { email: "test@thidiff.com" };

    verifyIdToken.yields(null, {
      getPayload() {
        return { email: req.body.email };
      },
    });

    User.findOne.resolves({
      get: sinon.stub().returns({ id: 1, login_time: "09:00:00" }),
      update: sinon.stub().resolves(),
    });
    Attendance.findOne.resolves({
      get: sinon.stub().returns({ id: 1 }),
      update: sinon.stub().resolves(),
    });

    res.json = (json) => {
      expect(json.message).to.be.equal("User LoggedIn SuccessFully");
      done();
    };

    login(req, res, next);
  });

  it("should return Bad Request Error when the email is not registered", (done) => {
    req.body = { googleToken: "Google Token" };

    verifyIdToken.yields(null, {
      getPayload() {
        return { email_verified: true, email: "test@thidiff.com" };
      },
    });

    User.findOne.resolves(null);

    next = (err) => {
      expect(err.message).to.be.equal(
        "This google account is not yet registered with us"
      );
      expect(err.statusCode).to.be.equal(401);
      done();
    };

    login(req, res, next);
  });

  afterEach(() => {
    User.findOne.reset();
  });
});
