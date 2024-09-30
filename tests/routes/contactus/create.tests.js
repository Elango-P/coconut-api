const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Contact us - Create", () => {

	const req = {};
	const res = {};
	let next;

	const ContactUs = { create: sinon.stub() };

	const sendResponseMail = sinon.stub().yields(null);
	const sendContactUsEmail = sinon.stub().yields(null);

	const create = proxyquire("../../../routes/public/contactus/create", {
		"../../db": {
			models: { ContactUs }
		},
		"./sendResponseMail": sendResponseMail,
		"./sendContactUsEmail": sendContactUsEmail
	});

	const body = {
		fullName: "bala",
		phone: "2322131231",
		message: "Test",
		subject: "Test",
		email: "bala+119@thidiff.com"
	};

	it("should create a contact us", (done) => {
		req.body = body;

		ContactUs.create.resolves({
			save: sinon.stub().resolves(null)
		});

		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("Contact us sented");
			done();
		};

		create(req, res, next);
	});

	afterEach(() => {
		ContactUs.create.reset();
	});
});
