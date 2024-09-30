const { monthOption } = require("../../helpers/RecurringTask");
const DateTime = require("../../lib/dateTime");
const Time = require("../../lib/time");

function schedularJob(result, userDefaultTimeZone, is24Hour) {
  const schedularJobList = result.get();
  let toEmails = [];


  if (schedularJobList.to_email) {
    let email = schedularJobList.to_email.split(',');

    if (Array.isArray(email) && email.length > 0) {
      email.forEach((element) => {
        toEmails.push({ value: element, label: element });
      });
    }
  }
  let monthValue = monthOption.find((data)=>data?.value == schedularJobList?.month)
  const dayValue = schedularJobList.day && schedularJobList?.day?.split(',');
  return {
    id: schedularJobList.id,
    name: schedularJobList.name,
    job_name: schedularJobList.job_name,
    interval: schedularJobList.interval,
    api_url: schedularJobList.api_url,
    status: schedularJobList.status,
    statusText: schedularJobList.status === 1 ? "Active" : "InActive",
    notes: schedularJobList.notes,
    started_at: schedularJobList.started_at,
    completed_at: schedularJobList.completed_at,
    company_id: schedularJobList.company_id,
    start_time: schedularJobList.start_time ? schedularJobList.start_time : "",
    to_email: toEmails ? toEmails : '',
    to_slack: schedularJobList.to_slack,
    userDefaultTimeZone: schedularJobList.userDefaultTimeZone,
    end_time: schedularJobList.end_time ? schedularJobList.end_time: "",
    startTime: schedularJobList.start_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(schedularJobList.start_time,new Date(),userDefaultTimeZone) : "",
    endTime: schedularJobList.end_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(schedularJobList.end_time,new Date(),userDefaultTimeZone) : "",
    day: dayValue,
    date: schedularJobList?.date,
    month: schedularJobList?.month,
    type: schedularJobList?.type,
    monthValue: monthValue,
    start_date: schedularJobList?.start_date,
    end_date: schedularJobList?.end_date,
    object_status: schedularJobList?.object_status,
    object_name: schedularJobList?.object_name,
    date_type: schedularJobList?.date_type,
  };
}
module.exports = schedularJob;
