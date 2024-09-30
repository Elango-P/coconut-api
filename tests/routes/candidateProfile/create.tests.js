const proxyquire = require("proxyquire");
const sinon = require("sinon");
require("sinon-as-promised");
const expect = require("chai").expect;

describe("Candidate Profile - Create", () => {

	const req = {};
	const res = {};
	let next;
	req.files = { file: { name: "test.docx", path: "/upload/resumes" }, profileImage: { name: "test.png", path: "/upload/photo" } };

	const CandidateProfile = { create: sinon.stub() };
	const CandidateMessage = { create: sinon.stub() };

	const sendResponseMail = sinon.stub().yields(null);
	const sendPostResumeEmail = sinon.stub().yields(null);
	const s3 = {
		uploadFile: sinon.stub().yields(null),
		getFileDetail: sinon.stub().yields(null, "filename.docx")
	};

	const create = proxyquire("../../../routes/candidateProfile/add", {
		"../../db": {
			models: { CandidateProfile, CandidateMessage }
		},
		"./sendResponseMail": sendResponseMail,
		"./sendPostResumeEmail": sendPostResumeEmail,
		"../../lib/s3": s3
	});

	const body = {
		firstName: "Bala",
		lastName: "R",
		phone: "2322131231",
		gender: "Female",
		maritalStatus: "Married",
		email: "bala+119@thidiff.com",
		currentAddress: "test",
		currentArea: "test",
		currentCity: "Noida",
		currentState: "Assam",
		currentPincode: 212121,
		permanentAddress: "test",
		permanentArea: "test",
		permanentCity: "Pune",
		permanentState: "Meghalaya",
		permanentPincode: 233132,
		qualification: "B.E",
		department: "CS",
		yearOfPassing: 2011,
		position: "QA Analyst",
		experienceYear: 5,
		experienceMonth: 6,
		projectTitle: "",
		projectPeriod: "",
		projectDescription: "",
		courseName: "",
		coursePeriod: "",
		courseInstitution: "",
		currentSalaryLakhs: 12,
		currentSalaryThousand: 16,
		salaryLakhs: 16,
		salaryThousands: 16,
		message: "Test Message",
		status: 1,
		percentage: 75,
		age: 22,
		dob: "10-DEC-1990",
		skills: "[]",
		stayingWith: "Parents"
	};

	it("should create a candidateProfile", (done) => {
		req.body = body;

		CandidateProfile.create.resolves({
			get: sinon.stub().returns({ candidateId: 1 }),
			save: sinon.stub().resolves(null)
		});

		CandidateMessage.create.resolves(null);

		res.json = (status, json) => {
			expect(status).to.be.equal(201);
			expect(json.message).to.be.equal("Submitted");
			done();
		};

		create(req, res, next);
	});

	afterEach(() => {
		CandidateMessage.create.reset();
	});
});
