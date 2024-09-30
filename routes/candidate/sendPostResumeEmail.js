const resumeEmail = require("../../lib/resumeEmail");
const config = require("../../lib/config");
const utils = require("../../lib/utils");
const sendGridService = require("../../lib/mail");

const { CandidateProfile } = require("../../db").models;

function sendPostResumeEmail(candidateProfile, attachment, callback) {
	CandidateProfile
		.findOne({ where: { id: candidateProfile.id } })
		.then((candidate) => {
			const overAllExperience = candidate.overall_experience ? ` - ${candidate.overall_experience} years` : "";
			const fullName = `${candidate.first_name} ${candidate.last_name}`;

			const subjectContent = `${candidate.position} - ${fullName} - ${candidate.qualification}[${candidate.department}]${overAllExperience}`;
			const data = {
				from: candidate.email,
				to: `${config.jobsEmail}`,
				subject: `[ThiDiff] Job Application: ${subjectContent}`,
				template: "post-resume-email",
				substitutions: {
					fullName,
					phone: candidate.phone,
					gender: candidate.gender,
					willingToWorkInShift: candidate.willing_to_work_in_shift,
					jobReferenceType: candidate.job_reference_type,
					jobReferenceName: candidate.job_reference_name,
					maritalStatus: candidate.marital_status,
					email: candidate.email,
					currentAddress: candidate.current_address,
					currentCountry: candidate.current_country,
					currentArea: candidate.current_area,
					currentCity: candidate.current_city,
					currentState: candidate.current_state,
					currentPincode: candidate.current_pincode,
					permanentAddress: candidate.permanent_address,
					permanentCountry: candidate.permanent_country,
					permanentArea: candidate.permanent_area,
					permanentCity: candidate.permanent_city,
					permanentState: candidate.permanent_state,
					permanentPincode: candidate.permanent_pincode,
					qualification: candidate.qualification,
					department: candidate.department,
					yearOfPassing: candidate.year_of_passing,
					position: candidate.position,
					projectTitle: candidate.project_title,
					projectPeriod: candidate.project_period,
					projectDescription: candidate.project_description,
					courseName: candidate.course_name,
					coursePeriod: candidate.course_period,
					courseInstitution: candidate.course_institution,
					message: candidate.message,
					token: candidate.token,
					status: candidate.status,
					createdAt: candidate.created_at,
					percentage: candidate.percentage,
					overallExperience: candidate.overall_experience,
					currentSalary: candidate.current_salary,
					expectedSalary: candidate.expected_salary,
					positionType: candidate.position_type,
					dob: candidate.dob,
					formattedDOBDate: utils.formatDate(candidate.dob, "DD-MMM-YYYY"),
					relevantExperience: candidate.relevant_experience,
					expectedCostPerHour: candidate.expected_cost_per_hour,
					skills: JSON.parse(candidate.skills),
					avatarURL: `${config.baseUrl}/candidateProfile/v1/avatar/${candidate.avatar}`,
					stayingWith: candidate.staying_with,
					tenthYearOfPassing: candidate.tenth_year_of_passing,
					tenthPercentage: candidate.tenth_percentage,
					twelvethYearOfPassing: candidate.twelveth_year_of_passing,
					twelvethPercentage: candidate.twelveth_percentage,
					degreeArrear: candidate.degree_arrear ? "Yes" : "No",
					didCourse: candidate.did_course,
					didCourseText: candidate.did_course ? "Yes" : "No",
					didProject: candidate.did_project,
					didProjectText: candidate.did_project ? "Yes" : "No",
					linkedinProfileName: candidate.linkedin_profile_name,
					facebookProfileName: candidate.facebook_profile_name,
					githubProfileName: candidate.github_profile_name,
					behanceProfileName: candidate.behance_profile_name,
					linkedinUrl: `http://www.linkedin.com/in/${candidate.linkedin_profile_name}`,
					facebookUrl: `https://www.facebook.com/${candidate.facebook_profile_name}`,
					githubUrl: `https://www.github.com/${candidate.github_profile_name}`,
					behanceUrl: `https://www.behance.net/${candidate.behance_profile_name}`,
					jobTitle: candidate.job_title,
					joinedMonth: candidate.joined_month,
					joinedYear: candidate.joined_year,
					companyName: candidate.company_name,
					knownLanguages: candidate.known_languages,
					employmentEligibility: candidate.employment_eligibility,
					age: candidate.age,
					vaccineStatus: candidate.vaccine_status
				},
				attachment, fileName: candidate.file
			};


            sendGridService.sendEmail(data, config.sendGridAPIKey, err => {
				callback()
			})
		});
}

module.exports = sendPostResumeEmail;
