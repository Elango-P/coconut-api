const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;
const utils = require("../../../lib/utils");

describe("User - Get", () => {

	const req = { log: { error: sinon.stub() } };
	const res = { };
	let next;

	const User = { findOne: sinon.stub() };

	const get = proxyquire("../../../routes/user/get", {
		"../../db": { models: { User } }
	});

	it("should get a user", (done) => {
		req.user = { id: 1 };

		const user = {
			id: 12,
			
			name: "Admin",
			last_name: "ThiDiff",
			email: "Admin@thidiff.com",
			role: 2,
			profile_photo: "profile_photo_12.jpg",
			mobile: "8220391210",
			emergency_mobile: null,
			date_of_birth: null,
			local_address: null,
			permanent_address: null,
			parents_contact: null,
			blood_group: null,
			pan_card: null,
			passport: null,
			voter_card: null,
			aadhar_card: null,
			google_id: null,
			active: 1,
			available_leave_balance: 0,
			login_time: "09:00:00",
			last_loggedin_at: null,
			band: "Band1",
			date_of_joining: "2017-02-27",
			gender: null,
			marital_status: null,
			nationality: null,
			notice_period: null,
			mode_of_recruitment: null,
			minimum_working_hours: null,
			status: null,
			force_daily_update: null,
			evaluation_date: null,
			slack_name: null,
			minimum_completed_tickets: null,
			minimum_reported_tickets: null,
			minimum_story_points: null,
			minimum_productive_hours: null,
			facebook_id: null,
			salary_per_day: null,
		};

		const returnData = {
			id: 12,
			
			name: "Admin",
			lastName: "ThiDiff",
			email: "Admin@thidiff.com",
			role: 2,
			roleText: "Developer",
			userType: null,
			profilePhotoUrl: utils.getUserMediaUrl(user.profile_photo),
			profilePhoto: user.profile_photo,
			formattedDate: utils.formatDate(user.date_of_birth, "DD-MM-YYYY"),
			mobile: "8220391210",
			emergencyMobile: null,
			dateOfBirth: null,
			localAddress: null,
			permanentAddress: null,
			parentsContact: null,
			bloodGroup: null,
			panCard: null,
			passport: null,
			voterCard: null,
			aadharCard: null,
			googleId: null,
			active: 1,
			activeText: "Active",
			availableLeaveBalance: 0,
			loginTime: "09:00:00",
			lastLoggedinAt: null,
			band: "Band1",
			dateOfJoining: "2017-02-27",
			dateOfJoiningFormattedDate: utils.formatDate(user.date_of_joining, "DD-MM-YYYY"),
			gender: null,
			maritalStatus: null,
			nationality: null,
			noticePeriod: null,
			modeOfRecruitment: null,
			minimumWorkingHours: null,
			status: null,
			forceDailyUpdate: null,
			allowManualLogin: null,
			evaluationDate: null,
			evaluationDateFormattedDate: null,
			slackName: null,
			minimumCompletedTickets: null,
			minimumReportedTickets: null,
			minimumStoryPoint: null,
			minimumProductiveHours: null,
			facebookId: null,
			salaryPerDay: null,
		};

		User.findOne.resolves({
			get: sinon.stub().returns(user)
		});

		res.json = (json) => {
			expect(json).to.eql(returnData);
			done();
		};

		get(req, res, next);
	});

	afterEach(() => {
		User.findOne.reset();
	});
});
