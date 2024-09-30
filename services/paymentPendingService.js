const { GROUP_PENDING } = require('../helpers/Status');
const Number = require("../lib/Number");
const config = require("../lib/config");
const Currency = require('../lib/currency');
const DateTime = require('../lib/dateTime');
const String = require('../lib/string');

const {
  account: accountModel,
  status: statusModel,
  Payment,
  PaymentAccount,
} = require('../db').models;

class PaymentPendingReportService {
  static async list(company_id) {
    const where = {};
    where.company_id = company_id;
    // Search by name

    const whereStatus = {};

    whereStatus.group = GROUP_PENDING;

    const query = {
      attributes: { exclude: ['deletedAt'] },
      order: [['id', 'DESC']],
      include: [
        {
          required: true,
          model: statusModel,
          as: 'statusDetail',
          where:whereStatus
        },
        {
          required:false,
          model: PaymentAccount,
          as: 'paymentAccountDetail',
          
        },
        {
          required: true,
          model: accountModel,
          as: 'accountDetail',
        },
      ],
      where,
    };
    let totalAmount=0
    // Get account list and count
    const details = await Payment.findAndCountAll(query);
    const data = [];
    details.rows.forEach(async (paymentsValue) => {

      const {
        id,
        date,
        amount,
        paymentAccountDetail,
        accountDetail,
      } = paymentsValue.get();
      totalAmount += Number.Get(amount)
      data.push({
        id,
        payment_number: id,
        date: DateTime.Format(date),
        account: accountDetail?.name,
        accountId: accountDetail?.id,
        paymentAccount: paymentAccountDetail?.payment_account_name?paymentAccountDetail?.payment_account_name:"",
        amount: Currency.IndianFormat(amount),
        redirect_link: `${config.webUrl}/payment/detail/${id}`
      });
    });

   
    return {
      totalAmount: Currency.IndianFormat(totalAmount),
      paymentList: data
    };
  }
}

module.exports = PaymentPendingReportService;
