const { Expo } = require('expo-server-sdk');
const ArrayList = require("../lib/ArrayList");
const UserService = require("./UserService");
const CompanyService = require("./CompanyService");
const expo = new Expo();
const ProjectTicketTypeService = require('./projectTicketTypeService');
const StatusService = require("./StatusService");
const utils = require("../lib/utils");
const DateTime = require("../lib/dateTime");
const SlackService = require("./SlackService");
const dateTime = new DateTime();
const { Ticket, Project } = require('../db').models;


class NotificationService{

    static async sendPushNotification  (params,additionalParam={}) {

        let expoPushTokens = ArrayList.get(params?.token);
        const messages = ArrayList.isArray(expoPushTokens) && expoPushTokens.map(token => ({
            to: token,
            sound: 'default',
            title: params?.title,
            body: params?.message,
            data: additionalParam,
        })) || []
      
        if(ArrayList.isArray(messages)){
        const chunks = expo.chunkPushNotifications(messages);
        const ArrayValue = [];
      
        for (let chunk of chunks) {
          try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            ArrayValue.push(...ticketChunk);
          } catch (error) {
            console.error('Error sending push notification:', error);
          }
        }
        return ArrayValue;
    }
      };

      static async sendDueDateChangeNotification (ticket_id, requestUserId) {

        let ticketTypeDetail;
    
        let statusDetail;
    
        let ticketDetail = await Ticket.findOne({
          where: { id: ticket_id }
        })
    
        if (!ticketDetail) {
          throw { message: "Ticket Not Found" }
        }
    
        const { id, assignee_id, company_id, due_date, summary, type_id, status, ticket_number } = ticketDetail;
    
        let requestUserDetail = await UserService.getSlack(requestUserId, company_id);
    
        let assigneeDetail = await UserService.getSlack(assignee_id, company_id);
    
        let companyDetail = await CompanyService.getCompanyDetailById(company_id);
    
        if (type_id) {
          ticketTypeDetail = await ProjectTicketTypeService.getById(type_id, company_id)
        }
    
        if (status) {
          statusDetail = await StatusService.getData(status, company_id)
        }
    
        if (requestUserDetail && !requestUserDetail.slack_id) {
          throw { message: "Request User Slack Id Not Found" }
        }
    
        if (assigneeDetail && !assigneeDetail.slack_id) {
          throw { message: "Assignee User Slack Id Not Found" }
        }
    
        const formattedETA = due_date ? `${utils.formatDate(due_date, dateTime.formats.frontendDateFormat)}` : "";
        let projectDetail = await Project.findOne(({ where : { id: ticketDetail && ticketDetail?.project_id, company_id: company_id}}))
    
        const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`
    
        const text = unescape(`<@${assigneeDetail.slack_id}> Your Ticket Due Date changed to ${formattedETA} \n [${ticketTypeDetail ? `${ticketTypeDetail.name} -` : ""}${statusDetail.name}] ${ticketSummary}`);
    
        SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text)
    
      }
}

module.exports=NotificationService;