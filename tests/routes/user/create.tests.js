"use strict";

const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("User - add", () => {

	const User = { findOne: sinon.stub(), create: sinon.stub() };
	const req = { user: { id: 1 } };
	const res = {};
	let next;

	const addUser = proxyquire("../../../routes/user/create", {
		"../../db": { models: { User } }
	});

	it("should create a user", (done) => {
		req.body = {
			name: "Test",
			email: "Test@thidiff.com",
			role: 1,
			availableLeaveBalance: 0,
			active: 1,
			updated_by: req.user.id
		};

		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("User added");
			done();
		};

		User.findOne.resolves(0);
		User.create.resolves(1);

		addUser(req, res, next);
	});

	it("should create a user already exists", (done) => {
		req.body = {
			name: "Test",
			email: "Test@thidiff.com",
			role: 1,
			availableLeaveBalance: 0,
			active: 1
		};

		next = (err) => {
			expect(err.statusCode).to.be.equal(404);
			expect(err.message).to.be.equal("User already exists");
			done();
		};

		User.findOne.resolves(1);
		User.create.resolves({ get: sinon.stub().withArgs("user_id").returns(1) });

		addUser(req, res, next);
	});

	it("should return Bad Request Error when the firstname is required", (done) => {
		req.body = { email: "Test@thidiff.com", role: 1, availableLeaveBalance: 0, active: 1 };

		next = (error) => {
			expect(error.message).to.be.equal("First Name is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		addUser(req, res, next);
	});

	it("should return Bad Request Error when the email is required", (done) => {
		req.body = { name: "Test", role: 1, availableLeaveBalance: 0, active: 1 };

		next = (error) => {
			expect(error.message).to.be.equal("Email is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		addUser(req, res, next);
	});


	it("should return Bad Request Error when the email is invalid", (done) => {
		req.body = { name: "Test", email: "Test@thidiff", role: 1, availableLeaveBalance: 0, active: 1 };

		next = (error) => {
			expect(error.message).to.be.equal("Invalid Email");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		addUser(req, res, next);
	});

	afterEach(() => {
		User.findOne.reset();
		User.create.reset();
	});

});
