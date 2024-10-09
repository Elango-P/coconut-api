
const ObjectName = require('../helpers/ObjectName');
const History = require('../services/HistoryService');
const StatusService = require('../services/StatusService');

const { Ticket, Slack, Media: MediaModal, Project } = require('../db').models;
const CompanyService = require("../services/CompanyService");
const SlackService = require("../services/SlackService");
const S3 = require("../lib/s3");
const { default: axios } = require('axios');
const fs = require("fs");
const ProjectTicketTypeService = require("./projectTicketTypeService");
const UserService = require("./UserService");
const DateTime = require("../lib/dateTime");


class SlackTicketService {


    static getSlackDetail = async ({ objectId, objectName, slackName, slackId, companyId }) => {
        try {

        let where = new Object();

        if (objectId) {
            where.object_id = objectId;
        }

        if (objectName) {
            where.object_name = objectName;
        }

        if (slackName) {
            where.slack_name = slackName
        }

        if (slackId) {
            where.slack_id = slackId
        }

        where.company_id = companyId;

        const slackDetail = await Slack.findOne({ where: where });

        return slackDetail;
    } catch (err){
        console.log(err);
    }
    }

    static async createTicket(companyId, body) {
        try {

            if (!companyId) {
                return res.json('Company Id Required');
            }

            let assigneeId;
            let reporterId;
            let summeryValue;

            // ticket create data
            let ticketCreateData = {
                company_id: companyId,
            };

            let statusId = await StatusService.getFirstStatus(ObjectName.TICKET, companyId);

            if (statusId) {
                ticketCreateData.status = statusId
            }

            if (body && body?.text) {

                if (body && body.text.includes('@')) {

                    let text = body?.text.split('@');

                    ticketCreateData.summary = text[0];

                    summeryValue = text[0];

                    let assigneeName = text[1].trim();

                    if (assigneeName) {

                        const slackAssigneeDetail = await this.getSlackDetail({ slackName: assigneeName, companyId });

                        if (slackAssigneeDetail) {

                            if (slackAssigneeDetail) {

                                assigneeId = slackAssigneeDetail?.object_id;

                                ticketCreateData.assignee_id = slackAssigneeDetail?.object_id;
                            }
                        }
                    }

                } else {
                    ticketCreateData.summary = body?.text;
                    summeryValue = body?.text;
                }
            }

            if (body && body?.channel_id) {

                const projectDetail = await this.getSlackDetail({ slackId: body?.channel_id, companyId });

                if (projectDetail) {
                    ticketCreateData.project_id = projectDetail?.object_id;
                }
            }

            if (body && body?.user_id) {

                const reporterDetail = await this.getSlackDetail({ slackId: body?.user_id, companyId });

                if (reporterDetail) {
                    ticketCreateData.reporter_id = reporterDetail?.object_id;
                    reporterId = reporterDetail?.object_id;
                }
            }

            let ticketDetails = await Ticket.create(ticketCreateData);

            History.create("Task Added", { user: { id: reporterId } }, ObjectName.TICKET_TASK, ticketDetails.id);

            return ticketDetails;

        } catch (error) {
            console.log(error);
            res.json(error.message);
        }
    }


    static async create(companyId, body) {
        try {
            let ticketDetail = await this.createTicket(companyId, body);

            return ticketDetail;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async createWithAttachment(companyId, body) {

        try {
            let ticketDetail = await this.createTicket(companyId, body);


            if (ticketDetail) {

                let companyDetail = await CompanyService.getCompanyDetailById(companyId);

                const ticketSummary = ` <${companyDetail.portal_url}/ticket/details/${ticketDetail && ticketDetail?.id}|${ticketDetail && ticketDetail?.id} : ${summeryValue}>`;


                return {
                    "response_type": "in_channel",
                    "text": ticketSummary
                };

            }
        } catch (err) {
            console.log(err);
            return {
                "response_type": "in_channel",
                "text": err.message
            };
        }
    }

    static async downloadAttachment(url, companyId, callback) {
        try {

        let accessToken = await SlackService.authenticate(companyId);

        const writer = fs.createWriteStream("assets/ticketAttachment.png");

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {

            writer.on('finish', () => {
                resolve();
                return callback();
            });

            writer.on('error', (error) => {
                reject(error);
                return callback();
            });
        })
    } catch (err){
        console.log(err);
    }

    }

   static async sendTicketAssigneeNotification (ticket_id, reporter_id,oldAssignee_id) {
        try{
                let ticketTypeDetail;
        
                let statusDetail;
        
                let ticketDetail = await Ticket.findOne({
                    where: { id: ticket_id }
                })
        
                if (!ticketDetail) {
                    throw { message: "Ticket Not Found" }
                }
        
                const { assignee_id, company_id, summary, type_id, status, ticket_number,due_date } = ticketDetail;
        
                if (type_id) {
                    ticketTypeDetail = await ProjectTicketTypeService.getById(type_id, company_id)
                }
        
                if (status) {
                    statusDetail = await StatusService.getData(status, company_id)
                }
        
                let reporterDetail;
                if(reporter_id){
                     reporterDetail = await UserService.getSlack(reporter_id, company_id);
                }
                let projectDetail = await Project.findOne(({ where : { id: ticketDetail && ticketDetail?.project_id, company_id: company_id}}))
        
                let newAssignee = await UserService.getSlack(assignee_id, company_id);
        
                let oldAssignee;
                if(oldAssignee_id){
                 oldAssignee = await UserService.getSlack(oldAssignee_id, company_id);
                }
        
                let companyDetail = await CompanyService.getCompanyDetailById(company_id);
                if (companyDetail) {
                    const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail && projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`
                    const text = unescape(`<@${newAssignee && newAssignee.slack_id}> Ticket assigned to you \n [Due Date: ${DateTime.shortMonthDate(due_date)}] ${ticketSummary}`);
                    await SlackService.sendMessageToUser(company_id, newAssignee && newAssignee?.slack_id, text)
                }
        
                if (oldAssignee) {
                    const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail && projectDetail?.slug}/${ticket_number}|${ticket_number} : ${summary}>`
                    const text = unescape(`<@${oldAssignee && oldAssignee?.slack_id}> Ticket unAssigned from you \n [${ticketTypeDetail ? `${ticketTypeDetail.name} -` : ""} ${statusDetail && statusDetail.name}] ${ticketSummary}`);
                    await SlackService.sendMessageToUser(company_id, oldAssignee && oldAssignee?.slack_id, text)
                }
        
            }catch(err){
                console.log(err);
            }
        
                
            }
}

module.exports = SlackTicketService;