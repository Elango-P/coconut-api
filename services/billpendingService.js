const { GROUP_PENDING } = require('../helpers/Status');
const Currency = require('../lib/currency');
const DateTime = require('../lib/dateTime');

const { Bill, account: accountModel, status: statusModel, Purchase, User, Slack, Media } = require('../db').models;

class BillPendingReportService {
  static async list(company_id) {
    // Sortable Fields
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
          required: false,
          model: accountModel,
          as: 'account',
        },
        {
          required: true,
          model: statusModel,
          as: 'statusDetail',
          where: whereStatus,
        },
        {
          required: false,
          model: statusModel,
          as: 'gstStatusDetail',
        },
      ],
      where,
    };

    // Get account list and count
    const details = await Bill.findAndCountAll(query);

    const data = [];
    details.rows.forEach(async (billsValue) => {
      const { id, bill_date, net_amount, createdAt, updatedAt, billing_name, bill_number, account, invoice_number } =
        billsValue.get();
      data.push({
        id,
        bill_number: bill_number,
        bill_date: DateTime.Format(bill_date),
        net_amount: Currency.GetFormattedCurrency(net_amount),
        account_name: account && account?.name,
        billing_name: billing_name,
        invoice_number: invoice_number,

        createdAt: DateTime.defaultDateFormat(createdAt),
        updatedAt: DateTime.defaultDateFormat(updatedAt),
      });
    });

    return data;
  }
}

module.exports = BillPendingReportService;
