
const Brand = require('../../helpers/Brand');
const { BAD_REQUEST, OK } = require('../../helpers/Response');
const Request = require('../../lib/request');

const { productBrand } = require('../../db').models;

async function list(req, res, next) {
  const companyId = Request.GetCompanyId(req);

  if (!companyId) {
    return res.json(BAD_REQUEST, 'Company Not Found');
  }
  const where = {};

  where.company_id = companyId;
  where.status = Brand.STATUS_ACTIVE;

  const query = {
    order: [['name', 'ASC']],
    where,
  };

  try {
    // Get Vendor list and count
    const vendors = await productBrand.findAndCountAll(query);

    // Return Vendor list is null
    if (vendors.count === 0) {
      return res.json({ message: 'Vendors not found' });
    }

    const data = [];
    vendors.rows.forEach((vendor) => {
      const { id, name } = vendor.get();

      data.push({
        id,
        name,
      });
    });

    res.json(OK, {
      data,
    });
  } catch (err) {
    console.log(err);
    res.json(OK, { message: err.message });
  }
}

module.exports = list;
