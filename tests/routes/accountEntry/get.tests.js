const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Account Entry Get Details", () => {

	const req = {
		isAdmin: true,
	};
	const res = {};
	let next;

	const AccountEntry = { findById: sinon.stub() };

	const getAccountEntryDetail = proxyquire("../../../routes/accountEntry/get", {
		"../../db": {
			models: { AccountEntry }
		}
	});

	const accountEntryData = {
		id: 1,
		date: "2017-11-20T12:32:12.000Z",
		type: "debit",
		category_id: 1,
		category_name: "lunch",
		payee_id: 1,
		payee_name: "Junior Kuppanna",
		mode_of_payment: "cheque",
		invoice_number: "1234567890",
		invoice_date: "2017-11-20T23:32:12.000Z",
		invoice_amount: 500,
		sgst_amount: 80,
		cgst_amount: 60,
		tds_amount: null,
		payable_amount: 360,
		notes: "Team lunch",
		attachments: null,
		created_at: "2017-11-20T13:47:46.000Z",
		updated_at: "2017-11-20T13:47:46.000Z"
	};

	const jsonData = {
		id: accountEntryData.id,
		date: accountEntryData.date,
		type: accountEntryData.type,
		categoryId: accountEntryData.category_id,
		categoryName: accountEntryData.category_name,
		payeeId: accountEntryData.payee_id,
		payeeName: accountEntryData.payee_name,
		paymentMode: accountEntryData.mode_of_payment,
		invoiceNumber: accountEntryData.invoice_number,
		invoiceDate: accountEntryData.invoice_date,
		invoiceAmount: accountEntryData.invoice_amount,
		sgstAmount: accountEntryData.sgst_amount,
		cgstAmount: accountEntryData.cgst_amount,
		tdsAmount: accountEntryData.tds_amount,
		payableAmount: accountEntryData.payable_amount,
		notes: accountEntryData.notes,
		attachments: null,
		createdAt: accountEntryData.created_at,
		updatedAt: accountEntryData.updated_at
	};

	it("should get the account entry details", (done) => {
		req.params = { id: 1 };

		AccountEntry.findById.resolves({ get: sinon.stub().returns(accountEntryData) });

		res.json = (json) => {
			expect(json).to.be.eql(jsonData);
			done();
		};

		getAccountEntryDetail(req, res, next);
	});

	it("should return Authorization Error when the account entry not found", (done) => {
		req.params = { id: 1 };

		AccountEntry.findById.resolves(null);

		next = (error) => {
			expect(error.message).to.be.equal("Account Entry not found");
			expect(error.statusCode).to.be.equal(404);
			done();
		};

		getAccountEntryDetail(req, res, next);
	});

	it("should return Authorization Error when the account entry id is empty", (done) => {
		req.params = { id: "" };

		next = (error) => {
			expect(error.message).to.be.equal("Account entry id is required");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		getAccountEntryDetail(req, res, next);
	});

	it("should return Authorization Error when the invalid account entry id", (done) => {
		req.params = { id: "test" };

		next = (error) => {
			expect(error.message).to.be.equal("Invalid Account Entry id");
			expect(error.statusCode).to.be.equal(400);
			done();
		};

		getAccountEntryDetail(req, res, next);
	});

	afterEach(() => {
		AccountEntry.findById.reset();
	});
});
