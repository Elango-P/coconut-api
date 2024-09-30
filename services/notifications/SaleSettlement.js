const Currency = require("../../lib/currency");
const DateTime = require("../../lib/dateTime");
const String = require("../../lib/string");
const CompanyService = require("../CompanyService");
const SlackService = require("../SlackService");
const UserService = require("../UserService");
const { Ticket, Project } = require('../../db').models;




class SaleSettlementNotification {
  static async sendReviwerChangeSlackNotification({
    company_id,
    reviwer_id,
    SsId,
    data,
  }) {
    let companyDetail = await CompanyService.getCompanyDetailById(company_id);
    let reviwerSlackDetail = await UserService.getSlack(reviwer_id, company_id);
    let reviewerDetail = await UserService.get(reviwer_id, company_id);

    const SsLink = `<${
      companyDetail.portal_url
    }/SaleSettlement/${SsId}> \n *Date*: ${DateTime.shortMonthDate(
      data?.dataValues?.date
    )} \n *Location*: ${
      data?.locationName
    } \n *Sale Executive*: ${String.concatName(
      reviewerDetail?.name,
      reviewerDetail?.last_name
    )} \n *Shift*: ${
      data?.shiftName
    } \n *Amount(Cash)*: ${Currency.IndianFormat(
      data?.dataValues?.amount_cash
    )} \n *Amount(UPI)*: ${Currency.IndianFormat(
      data?.dataValues?.amount_upi
    )} \n *Cash In Location*: ${Currency.IndianFormat(
      data?.dataValues?.cash_in_store
    )} \n *Cash To Office*: ${Currency.IndianFormat(
      data?.dataValues?.cash_to_office
    )}
		`;
    const text = unescape(
      `<@${reviwerSlackDetail?.slack_id}> SaleSettlement Assign To You  \n ${SsLink}`
    );
    await SlackService.sendMessageToUser(
      company_id,
      reviwerSlackDetail && reviwerSlackDetail?.slack_id,
      text
    );
  }
}

module.exports = SaleSettlementNotification;