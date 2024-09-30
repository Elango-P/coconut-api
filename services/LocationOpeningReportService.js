const {
    Attendance,
    User,
    Location: LocationModel,
  } = require('../db').models;


const { Op } = require("sequelize");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const DataBaseService = require("../lib/dataBaseService");
const DateTime = require("../lib/dateTime");
const { concatName } = require("../lib/string");
const mailService = require("./MailService");
const { getSettingValue } = require("./SettingService");
const CompanyService = require("./CompanyService");
const Location = require("../helpers/Location");

const locationService = new DataBaseService(LocationModel);
const attendanceModel = new DataBaseService(Attendance)
class LocationOpeningReportService{


    static async sendMail(params, fromMail, toMail, callback){

        let userDefaultTimeZone = params.timeZone;
        let companyDetail = await CompanyService.getCompanyDetailById(params?.companyId);
        let locationList = await locationService.find({where:{
            company_id: params?.companyId,
            type: Location.TYPE_STORE,
            status: Location.STATUS_ACTIVE
        }});

        let openLocationList=[]
        let notOpenLocationList = []
        if(locationList && locationList.length > 0){
            for (let i = 0; i < locationList.length; i++) {
                const value = locationList[i];

                let attendanceList = await attendanceModel.find({ include: [
                    {
                      required: false,
                      model: User,
                      as: 'user',
                    },
                  ],
                  where:{
                    store_id: value && value?.id,
                    company_id: params?.companyId,
                    date: DateTime.getSQlFormattedDate(new Date())
                }})
                let userDetail = [];
                if (attendanceList && attendanceList.length > 0) {
                for (let i = 0; i < attendanceList.length; i++) {
                    const { user, login, logout } = attendanceList[i];
                    userDetail.push({
                    userName: concatName(user?.name, user?.last_name),
                    image: user && user?.media_url,
                    loginTime: DateTime.getTimeByTimeZone(login,userDefaultTimeZone),
                    logOutTime: DateTime.getTimeByTimeZone(logout,userDefaultTimeZone),
                    });
                }
                openLocationList.push({
                    locationName: value && value?.name,
                    userList: userDetail
                })
                }else{
                    notOpenLocationList.push({
                        locationName: value && value?.name,
                    })
                }

                
            }
        }

        openLocationList.sort((a, b) => a.locationName.localeCompare(b.locationName));


        const emailSubstitutions = {
            openLocationList: openLocationList,
            date: DateTime.Format(params.currentDate),
            notOpenLocationList:notOpenLocationList,
            openedLocationCount:openLocationList && openLocationList.length,
            notOpenedLocationCount:notOpenLocationList && notOpenLocationList.length,
            companyLogo: companyDetail && companyDetail?.company_logo,
            companyName: companyDetail && companyDetail?.company_name,
            reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(),userDefaultTimeZone),
            schedularName: params?.schedularData?.name,

        }
      // Email Data
      const emailData = {
        fromEmail: fromMail,
        toEmail: toMail,
        template: 'locationOpeningReport',
        subject: `${params?.schedularData?.name} - ${DateTime.Format(params.currentDate)}`,
        substitutions: emailSubstitutions,
      };

      // Sent Email
      mailService.sendMail(params, emailData, async (err) => {
        if (err) {
          console.log(err);
        }
        return callback();
      });


    }
}

module.exports = LocationOpeningReportService;