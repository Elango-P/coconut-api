const ObjectName = require('../../helpers/ObjectName');
const History = require('../../services/HistoryService');
const companyService = require('../../services/CompanyService');

const { sendTicketAssigneeNotification } = require('../../services/notifications/ticket');

const SlackServiSlackTicketService = require("../../services/SlackTicketService");

const CompanyService = require("../../services/CompanyService");

const SlackService = require("../../services/SlackService");

const { Media } = require("../../helpers/Media");

const {  Media: MediaModal, Project } = require('../../db').models;

const fs = require("fs");

const S3 = require("../../lib/s3");

const { default: axios } = require('axios');

const createTicketWithAttachment = async (req, res) => {
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

        let ticketDetail = await SlackServiSlackTicketService.create(companyId, body)
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
    
                let conversationList = await SlackService.getConversationHistory(body.channel_id, companyId);
                    
                let files;
    
                if (conversationList && conversationList.length > 0) {
                    for (let i = 0; i < conversationList.length; i++) {
                        if (conversationList[i].files && conversationList[i].files.length > 0) {
                            files = conversationList[i].files;
                            break;
                        }
                    }
                }
    
                if (files && files.length > 0) {
    
                    let mediaCreateObject = {
                        name: `${ticketDetail.id}-ticketAttachment`,
                        file_name: `${ticketDetail.id}-ticketAttachment.png`,
                        visibility: Media.VISIBILITY_PUBLIC,
                        company_id: companyId,
                        object_id: ticketDetail.id,
                        object_name: ObjectName.TICKET,
                        feature: Media.FEATURE_ENABLED
                    };
    
                    let mediaDetail = await MediaModal.create(mediaCreateObject);
    
                    if (mediaDetail) {
    
                        let mediaUrl = files[0].url_private;
    
                        downloadAttachment(mediaUrl, companyId, () => {
                            S3.uploadLocalAttachmentToS3("media/ticketAttachment.png", `${mediaDetail.id}-${ticketDetail.id}-ticketAttachment.png`, () => {
                                fs.unlink("media/ticketAttachment.png", () => { });
                            });
                        });
    
                    }
    
                }

            }

        });

    } catch (error) {
        console.log(error);
        res.json(error.message);
    }
};

module.exports = createTicketWithAttachment;


async function downloadAttachment(url, companyId, callback) {

    let accessToken = await SlackService.authenticate(companyId);

    const writer = fs.createWriteStream("media/ticketAttachment.png");

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

}

module.exports = createTicketWithAttachment;
