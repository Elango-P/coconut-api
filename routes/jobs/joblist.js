const Jobs = require("../../helpers/Jobs");

// eslint-disable-next-line no-unused-vars
function Joblist(result) {
  const jobs = result.get();

  const data = {
    id: jobs.id,
    category: jobs?.category,
    sub_category: jobs.sub_category,
    job_title: jobs.job_title,
    slug: jobs.slug,
    location: jobs.location,
    experience: jobs.experience,
    sort: jobs.sort,
    job_description: jobs.job_description,
    mandatory_skills: jobs.mandatory_skills,
    requirements: jobs.requirements,
    responsibilities: jobs.responsibilities,
    status:
      jobs.status == Jobs.STATUS_ACTIVE ? Jobs.STATUS_ACTIVE_TEXT : Jobs.STATUS_INACTIVE_TEXT,
    minimum_experience: jobs.minimum_experience,
    maximum_experience: jobs.maximum_experience,
    maximum_salary: jobs.maximum_salary,
    job_type: jobs.job_type,
    project_name: jobs.project_name,
    course_name: jobs.course_name,
    show_current_address: jobs.show_current_address,
    show_employment_eligibility: jobs.show_employment_eligibility,
    show_home_town_address: jobs.show_home_town_address,
    show_skills: jobs.show_skills,
    show_expected_salary: jobs.show_expected_salary,
    show_current_salary: jobs.show_current_salary,
    show_employment: jobs.show_employment,
    show_project_details: jobs.show_project_details,
    show_course_details: jobs.show_course_details,
    show_vaccine_status: jobs.show_vaccine_status,
  };

  return data;
}

module.exports = Joblist;
