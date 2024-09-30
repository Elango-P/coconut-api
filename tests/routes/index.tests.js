const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const sinon = require("sinon");

describe("Route index", () => {
	const user = sinon.spy();
	const candidateProfile = sinon.spy();
	const ticketComponent = sinon.spy();
	// const ticketReport = sinon.spy();
	const quickLinks = sinon.spy();
	const ticket = sinon.spy();
	const attendance = sinon.spy();
	const holidays = sinon.spy();

	const server = {
		get: sinon.spy(),
		post: sinon.spy(),
		put: sinon.spy(),
		del: sinon.spy()
	};

	const stubs = {
		"./user": user,
		"./candidateProfile": candidateProfile,
		"./ticketComponent": ticketComponent,
		// "./ticketReport": ticketReport,
		"./quickLinks": quickLinks,
		"./ticket": ticket,
		"./attendance": attendance,
		"./holidays": holidays
	};

	const routeIndex = proxyquire("../../routes", stubs);

	beforeEach(() => {
		user.reset();
		candidateProfile.reset();
		ticketComponent.reset();
		// ticketReport.reset();
		quickLinks.reset();
		ticket.reset();
		attendance.reset();
		holidays.reset();
	});

	it("should register the user routes", () => {
		routeIndex(server);

		expect(user.calledWith(server)).to.be.true;
	});

	it("should register the candidateProfile routes", () => {
		routeIndex(server);

		expect(candidateProfile.calledWith(server)).to.be.true;
	});

	it("should register the ticketComponent routes", () => {
		routeIndex(server);

		expect(ticketComponent.calledWith(server)).to.be.true;
	});

	it("should register the ticketReport routes", () => {
		routeIndex(server);

		// expect(ticketReport.calledWith(server)).to.be.true;
	});

	it("should register the quickLinks routes", () => {
		routeIndex(server);

		expect(quickLinks.calledWith(server)).to.be.true;
	});

	it("should register the ticket routes", () => {
		routeIndex(server);

		expect(ticket.calledWith(server)).to.be.true;
	});
});
