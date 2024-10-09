const CompanyService = require('../CompanyService');
const SlackService = require('../SlackService');
const UserService = require('../UserService');

module.exports = {
  sendPurchaseDueDateChangeNotification: async ({ user_id, company_id, due_date, purchase_id }) => {
    let companyDetail = await CompanyService.getCompanyDetailById(company_id);
    let assigneeDetail = await UserService.getSlack(user_id, company_id);

    const ticketSummary = ` <${companyDetail?.portal_url}/purchase/${purchase_id}>`;
    const text = unescape(
      `<@${assigneeDetail?.slack_id}> Your Purchase Due Date Changed To ${due_date} \n ${ticketSummary}`
    );
    SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text);
  },

  sendPurchaseOwnerChangeNotification: async ({ user_id, company_id, purchase_id }) => {
    let companyDetail = await CompanyService.getCompanyDetailById(company_id);
    let assigneeDetail = await UserService.getSlack(user_id, company_id);

    const ticketSummary = ` <${companyDetail?.portal_url}/purchase/${purchase_id}>`;
    const text = unescape(`<@${assigneeDetail?.slack_id}>  Purchase Changed To You \n ${ticketSummary}`);
    SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text);
  },

  sendPurchaseStatusChangeNotification: async ({ user_id, company_id, purchase_id, statusName }) => {
    let companyDetail = await CompanyService.getCompanyDetailById(company_id);
    let assigneeDetail = await UserService.getSlack(user_id, company_id);

    const purchaseSummary = ` <${companyDetail?.portal_url}/purchase/${purchase_id}>`;
    const text = unescape(`<@${assigneeDetail?.slack_id}>  Your Purchase Status Changed To ${statusName} \n ${purchaseSummary}`);
    SlackService.sendMessageToUser(company_id, assigneeDetail && assigneeDetail?.slack_id, text);
  },
};
