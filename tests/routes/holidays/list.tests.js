const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("Holiday - List", () => {

	const req = { query: {}, log: { error: sinon.spy() } };
	const res = {};
	let next;

	const Holiday = { findAndCountAll: sinon.stub() };

	const list = proxyquire("../../../routes/holidays/list", {
		"../../db": { models: { Holiday } }
	});

	const holidayData = {
		id: 1,
		name: "Sankranti (Pongal) Festival",
		date: "2017-01-15",
		type: null,
		day: "Sunday",
		created_at: "2016-03-02T12:28:52.000Z"
	};

	const returnData = {
		id: 1,
		name: "Sankranti (Pongal) Festival",
		date: "15-01-2017",
		type: null,
		day: "Sunday",
		formattedDate: utils.formatDate(holidayData.date, "DD MMM, Y"),
		createdAt: "2016-03-02T12:28:52.000Z"
	};

	function verifyJson(json) {
		expect(json.count).to.be.equal(1);
		expect(json.currentPage).to.be.equal(1);
		expect(json.lastPage).to.be.equal(1);
		expect(json.holidays instanceof Array).to.be.true;
		expect(json.holidays).to.eql([returnData]);
	}


	it("should list all holidays", (done) => {

		Holiday.findAndCountAll.resolves({
			rows: [{ get: sinon.stub().returns(holidayData) }],
			count: 1
		});

		res.json = (json) => {
			verifyJson(json);
			done();
		};

		list(req, res, next);
	});

});
