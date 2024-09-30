const ObjectName = require('../../helpers/ObjectName');
const History = require('../../services/HistoryService');
const companyService = require('../../services/CompanyService');

const { sendTicketAssigneeNotification } = require('../../services/notifications/ticket');

const SlackServiSlackTicketService = require("../../services/SlackTicketService");

const CompanyService = require("../../services/CompanyService");
const { Project } = require("../../db").models;

const create = async (req, res) => {
    try {
        let body = req.body;

        // get Url
        let getUrl = req && req.rawHeaders && req.rawHeaders[1];

        // concat Url
        let Url = 'https://' + getUrl;

        let companyId = await companyService.getCompanyIdByPortalUrl(Url);

        if (!companyId) {
            return res.json('Company Id Required');
        }

        let ticketDetail = await SlackServiSlackTicketService.create(companyId, body);
        let projectDetail = await Project.findOne(({ where : { id: ticketDetail && ticketDetail?.project_id, company_id: companyId}}))

        if (ticketDetail) {

            let companyDetail = await CompanyService.getCompanyDetailById(companyId);

            const ticketSummary = ` <${companyDetail.portal_url}/ticket/${projectDetail && projectDetail?.slug}/${ticketDetail && ticketDetail?.id}|${ticketDetail && ticketDetail?.id} : ${ticketDetail.summary}>`;

            res.json({
                "response_type": "in_channel",
                "text": ticketSummary
            });
        }

        res.on('finish', async () => {

            History.create('Task Added', req, ObjectName.TICKET_TASK, ticketDetail.id);

            if (ticketDetail) {

                sendTicketAssigneeNotification(
                    ticketDetail && ticketDetail?.id,
                    ticketDetail.reporter_id
                );

            }

        });

    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
};

module.exports = create;
