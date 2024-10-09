const { Candidate, Media: MediaModal } = require("../../../db").models;
const { Media } = require("../../../helpers/Media");
const ObjectName = require("../../../helpers/ObjectName");
const Request = require("../../../lib/request");
const utils = require("../../../lib/utils");
const mediaService = require("../../../services/media");
const Number = require("../../../lib/Number")
function concatValue(from, to) {
  let detail = null;
  from = from ? Number.Get(from) : null;
  to = to ? Number.Get(to) : null;
  if (from && to) {
    detail = `${from}.${to}`;
  } else if (from) {
    detail = from;
  } else if (to) {
    detail = `0.${to}`;
  }
  return detail;
}
/**
 *  Get Overall Experience
 *
 * @param {*} from
 * @param {*} to
 */
async function add(req, res, next) {
  const data = req.body;
  let companyId = req && req.query && req.query.company_id || data?.company_id || req?.query?.company_id;
  const file = req && req.files && req.files.file ? req.files.file : "";
  const profileImage = req && req.files && req.files.profileImage ? req.files.profileImage : "";
  if (!data?.firstName) {
    return res.json(400, { message: "First Name is required" });
  }
  if (!data?.lastName) {
    return res.json(400, { message: "Last Name is required" });
  }
  try {
    const token = utils.md5Password(utils.getTimeStamp());
    let objectData = {
      first_name: data?.firstName,
      last_name: data?.lastName,
      phone: data?.phone,
      gender: data?.gender,
      marital_status: data?.maritalStatus,
      email: data?.email,
      age: data?.age !== '' ? Number.Get(data?.age) : null,
      current_address: data?.currentAddress || null,
      current_area: data?.currentArea || null,
      current_country: data?.currentCountry || null,
      current_city: data?.currentCity || null,
      current_state: data?.currentState || null,
      current_pincode: data?.currentPincode ? Number.Get(data?.currentPincode) : null,
      permanent_country: data?.permanentCountry || null,
      permanent_address: data?.permanentAddress || null,
      permanent_area: data?.permanentArea || null,
      permanent_city: data?.permanentCity || null,
      permanent_state: data?.permanentState || null,
      permanent_pincode: data?.permanentPincode ? Number.Get(data?.permanentPincode) : null,
      qualification: data?.qualification || null,
      department: data?.department || null,
      year_of_passing: data?.yearOfPassing ? Number.Get(data?.yearOfPassing) : null,
      position: data?.position || null,
      overall_experience: concatValue(
        isNaN(data?.experienceYear) ? null : Number.Get(data?.experienceYear),
        isNaN(data?.experienceMonth) ? null : Number.Get(data?.experienceMonth)
      ),
      project_title: data?.projectTitle || null,
      project_period: data?.projectPeriod || null,
      project_description: data?.projectDescription || null,
      course_name: data?.courseName || null,
      course_period: data?.coursePeriod || null,
      course_institution: data?.courseInstitution || null,
      current_salary: concatValue(data?.currentSalaryLakhs, data?.currentSalaryThousand),
      expected_salary: concatValue(data?.salaryLakhs, data?.salaryThousand),
      message: data?.message || null,
      status: 1,
      token,
      percentage: data?.percentage ? Number.Get(data?.percentage) : null,
      position_type: data?.positionType || null,
      dob: data?.dob || null,
      relevant_experience: concatValue(data?.relevantExperienceYear, data?.relevantExperienceMonth),
      expected_cost_per_hour: data?.expectedCostPerHour ? Number.Get(data?.expectedCostPerHour) : null,
      job_reference_type: data?.jobReferenceType || null,
      job_reference_name: data?.jobReferenceName || null,
      willing_to_work_in_shift: data?.willingToWorkInShift ? "Yes" : "No",
      skills: JSON.parse(data?.skills || '[]'), // default to an empty array if skills is not provided
      staying_with: data?.stayingWith || null,
      tenth_year_of_passing: data?.tenthYearOfPassing ? Number.Get(data?.tenthYearOfPassing) : null,
      tenth_percentage: data?.tenthPercentage ? Number.Get(data?.tenthPercentage) : null,
      twelveth_year_of_passing: data?.twelvethYearOfPassing ? Number.Get(data?.twelvethYearOfPassing) : null,
      twelveth_percentage: data?.twelvethPercentage ? Number.Get(data?.twelvethPercentage) : null,
      degree_arrear: data?.degreeArrear || null,
      did_course: data?.didCourse || null,
      did_project: data?.didProject || null,
      linkedin_profile_name: data?.linkedinProfileName || null,
      facebook_profile_name: data?.facebookProfileName || null,
      github_profile_name: data?.githubProfileName || null,
      behance_profile_name: data?.behanceProfileName || null,
      job_title: data?.jobTitle || null,
      joined_month: data?.joinedMonth || null,
      joined_year: data?.joinedYear ? Number.Get(data?.joinedYear) : null,
      company_name: data?.companyName || null,
      known_languages: data?.knownLanguages || null,
      employment_eligibility: data?.employmentEligibility || null,
      vaccine_status: data?.didVaccineStatus || null,
      company_id: Number.Get(companyId) || null,
    }
    await Candidate.create(objectData).then(async (candidate) => {
      // file Upload
      if (file && file !== undefined) {
        let imageData = {
          file_name: file?.name.trim(),
          name: file?.name.trim(),
          company_id: Number.Get(companyId),
          object_id: candidate?.id,
          object_name: ObjectName.CANDIDATE,
          visibility: Media.VISIBILITY_PUBLIC,
        };
        let mediaDetails = await MediaModal.create(imageData);
        if (mediaDetails) {
          await mediaService.uploadMedia(
            file?.path,
            mediaDetails?.id,
            file?.name,
            mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false
          );
        }
      }
      if (profileImage && profileImage !== undefined) {
        let imageData = {
          file_name: profileImage?.name.trim(),
          name: profileImage?.name.trim(),
          company_id: Number.Get(companyId),
          object_id: candidate?.id,
          object_name: ObjectName.CANDIDATE,
          visibility: Media.VISIBILITY_PUBLIC,
        };
        let mediaDetails = await MediaModal.create(imageData);
        if (mediaDetails) {
          await mediaService.uploadMedia(
            profileImage?.path,
            mediaDetails?.id,
            profileImage?.name,
            mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false
          );
        }
      }
      res.json(201, {
        message: " Candidate Added",
        candidateId: candidate.id,
      });
    }).catch((err) => {
      console.log(err);
      res.json(500, { message: "Internal Server Error" });
    });
  } catch (err) {
    req.log.error(err);
    next(err);
  }
}
module.exports = add;