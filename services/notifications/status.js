

const StatusService = require("../StatusService");

const Status = require("../../helpers/Status");

const UserService = require("../UserService");

const SlackService = require("../SlackService");

const CompanyService = require("../CompanyService");

class StatusNotificationService {


    static async SendStatusUpdateNotificationToOwner(ownerId, objectName, oldStatusId, newStatusId, companyId, redirectUrl,userId) {
        try {

            if (objectName && oldStatusId && newStatusId && companyId && ownerId) {

                let oldStatusDetail = await StatusService.getData(oldStatusId, companyId);

                let newStatusDetail = await StatusService.getData(newStatusId, companyId)

                let companyDetail = await CompanyService.getCompanyDetailById(companyId);

                let defaultOwner =  await StatusService.GetDefaultOwner( newStatusDetail?.default_owner, userId)

                let ownerid = defaultOwner ? defaultOwner:ownerId

                if(newStatusDetail && newStatusDetail.notify_to_owner == Status.NOTIFY_TO_OWNER_ENABLED ){

                    let ownerSlackDetail = await UserService.getSlack(ownerid, companyId);

                    if(ownerSlackDetail && ownerSlackDetail.slack_id){

                        let textWithRedirectUrl = redirectUrl ? `<@${ownerSlackDetail.slack_id}>  <${companyDetail.portal_url}/${redirectUrl} : ${objectName} Status Changed ${oldStatusDetail.name} To ${newStatusDetail.name}>` : `<@${ownerSlackDetail.slack_id}> ${objectName} Status Changed ${oldStatusDetail.name} To ${newStatusDetail.name}`
                        
                        const text = unescape(textWithRedirectUrl)

                        SlackService.sendMessageToUser(companyId, ownerSlackDetail.slack_id, text)
                        
                    }
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = StatusNotificationService;