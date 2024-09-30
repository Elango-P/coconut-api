const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("Ticket Report - List", () => {

	const req = { user: { id: 2 } };
	const res = {};
	let next;

	const QuickLinks = { findAll: sinon.stub() };

	const listQuickLinks = proxyquire("../../../routes/quickLinks/list", {
		"../../db": { models: { QuickLinks } }
	});

	const quickLinks = {
		name: "Pending",
		status_id: "1",
		group_id: "1,2,3",
		type: 4,
		show_current_user: 1,
		excluded_user: "41,-1",
		ticket_type: "2",
		project_id: "1",
		release_id: "4",
		url: "/ticket?"
	};

	const returnData = [{
		name: "Pending",
		url: `${quickLinks.url}status=${quickLinks.status_id}&groupId=${quickLinks.group_id}&etaTo=${utils.getYesterdayDate()}&assignedTo=${req.user.id}&excludedUser=${quickLinks.excluded_user}&ticketType=${quickLinks.ticket_type}&projectId=${quickLinks.project_id}&releaseId=${quickLinks.release_id}`
	}];

	it("should return quick links", (done) => {
		QuickLinks.findAll.resolves([
			{ get: sinon.stub().returns(quickLinks) }
		]);

		res.json = (json) => {
			expect(json).to.eql(returnData);
			done();
		};

		listQuickLinks(req, res, next);
	});

});
