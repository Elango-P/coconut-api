const { GROUP_PENDING } = require('../helpers/Status');
const Currency = require('../lib/currency');
const DateTime = require('../lib/dateTime');
const String = require('../lib/string');

const {
  Bill,
  account: accountModel,
  status: statusModel,
  Purchase,
  User,
  Slack,
  Media,
  Location,
} = require('../db').models;

class PurchasePendingReportService {
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
          model: accountModel,
          as: 'account',
        },
        {
          required: true,
          model: Location,
          as: 'location',
        },
        {
          required: true,
          model: statusModel,
          as: 'statusDetail',
          where: whereStatus,
        },
        {
          required: false,
          model: User,
          as: 'UserDetails',
        },
      ],
      where,
    };

    // Get account list and count
    const details = await Purchase.findAndCountAll(query);
    const data = [];
    details.rows.forEach(async (purchase) => {

      const { UserDetails } = purchase;
      data.push({
        id: purchase.id,
        purchaseNumber: purchase.purchase_number,
        description: purchase.description,
       
        purchaseDate: DateTime.Format(purchase.purchase_date),
        owner_id: purchase.owner_id,
        vendorName: purchase.account ? purchase.account.name : "",
        netAmount:Currency.GetFormattedCurrency(purchase.net_amount),
        ownerName: purchase && String.concatName(UserDetails?.name, UserDetails?.last_name),
      });
    });

    return data;
  }
}

module.exports = PurchasePendingReportService;
