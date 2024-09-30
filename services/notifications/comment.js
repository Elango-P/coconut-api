const Url = require('../../lib/Url');
const Request = require('../../lib/request');
const SlackService = require('../SlackService');
const UserService = require('../UserService');
const CompanyService = require("../CompanyService");
const { BillService } = require("../services/billService");
const ObjectName = require("../../helpers/ObjectName");
const AccountService = require("../AccountService");
const PurchaseService = require("../PurchaseService");
const { Ticket, Project } = require('../../db').models;

const sendCommentNotification = async (users, req, comment,object_id,params) => {
  let companyId = Request.GetCompanyId(req);
  let userId = Request.getUserId(req)

  if (users && users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if(users[i]){
        const  id  = users[i];
        let userList = await UserService.getSlack(id, companyId);
        let senderSlack = await UserService.getSlack(userId, companyId);
        if (userList) {
          const commentDecoded = Url.RawURLDecode(comment);
          const formatedComment = JSON.parse(commentDecoded);
          const textArray = formatedComment.blocks.map(block => block.text);
          const joinedText = textArray.join('\n');
          let companyDetail = await CompanyService.getCompanyDetailById(companyId);
      
          const UpdatedComment = `*Comment:* ${joinedText}`;

          let link;
          if (params && params?.objectName == ObjectName.BILL || params && params?.objectName == ObjectName.PURCHASE) {
            if(params && params?.objectName == ObjectName.BILL){
              let billData = await BillService.getBillDetailById(object_id, companyId);
              let accountDetail = await AccountService.get(billData && billData?.account_id, companyId)
              const commentDecoded = Url.RawURLDecode(billData?.notes);
              const formatedComment = JSON.parse(commentDecoded);
              const textArray = formatedComment && formatedComment.blocks.map((block) => block.text);
              const joinedText = textArray && textArray.join('" "');
              link = ` <${companyDetail.portal_url}/bill/detail/${object_id}| Bill #${object_id} : ${accountDetail && accountDetail?.name ? accountDetail?.name : ""} ${joinedText ? `(${joinedText})` :""}>`;
            }

            if(params && params?.objectName == ObjectName.PURCHASE){
              let purchaseData = await PurchaseService.get(object_id, companyId);
              let accountDetail = await AccountService.get(purchaseData && purchaseData?.vendor_id, companyId)
              const commentDecoded = Url.RawURLDecode(purchaseData?.notes);
              const formatedComment = JSON.parse(commentDecoded);
              const textArray = formatedComment && formatedComment.blocks.map((block) => block.text);
              const joinedText = textArray && textArray.join('" "');
              link = ` <${companyDetail.portal_url}/purchase/${object_id}| Purchase #${object_id} : ${accountDetail && accountDetail?.name ? accountDetail?.name : ""} ${joinedText ? `(${joinedText})` :""}>`;
            }

          } else {
            let ticketDetail = await Ticket.findOne({
              where: {
                id: object_id,
                company_id: companyId,
              },
            });
            let projectDetail = await Project.findOne({
              where: { id: ticketDetail && ticketDetail?.project_id, company_id: companyId },
            });
            link = ` <${companyDetail.portal_url}/ticket/${projectDetail?.slug}/${ticketDetail?.ticket_number}|${ticketDetail?.ticket_number} : ${ticketDetail?.summary}>`;
          }

          const text = unescape(`<@${userList?.slack_id}> Comment added by <@${senderSlack?.slack_id}> \n ${link}\n ${UpdatedComment}`);

          if (joinedText) {
            SlackService.sendMessageToUser(companyId, userList && userList?.slack_id, text);
          }
        }
      }
    }
  }
};

module.exports = sendCommentNotification;
