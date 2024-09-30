const { Op } = require('sequelize');

const { storeProduct, productTag, productIndex, Location } = require('../db').models;

const DataBaseService = require('../lib/dataBaseService');
const Status = require('../helpers/Status');

const storeProductService = new DataBaseService(storeProduct);

const search = async (params, companyId) => {
  try {
    let { location, tag, brand, category } = params;

    const storeProductWhere = {};

    if (location) {
      storeProductWhere.store_id = location;
    }
    storeProductWhere.company_id = companyId;

    const productIds = [];
    if (tag !== '') {
      let tagData = await productTag.findAll({ where: { tag_id: tag, company_id: companyId } });

      if (tagData && tagData.length > 0) {
        for (let i = 0; i < tagData.length; i++) {
          productIds.push(tagData[i].product_id);
        }
      }
      storeProductWhere.product_id = { [Op.in]: productIds };
    }

    if (brand !== '' || category !== '') {
      let where = {};

      if (brand !== '') {
        where.brand_id = brand;
      }

      if (category !== '') {
        where.category_id = category;
      }

      where.company_id = companyId;

      let data = await productIndex.findAll({ where: where });

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          productIds.push(data[i].product_id);
        }
      }
      storeProductWhere.product_id = { [Op.in]: productIds };
    }

    let locationWhere = {};

    locationWhere.status = Status.ACTIVE_TEXT;
    if (location) {
      locationWhere.id = location;
    }
    let storeData = await Location.findAll({ where: locationWhere, attributes: ['id', 'name'] });

    let ids = storeData.map((location) => location.id);

    if (ids && ids.length > 0) {
      storeProductWhere.store_id = { [Op.in]: ids };
    }

    let storeProductQuery = {
      where: storeProductWhere,
    };
    const storeProductListData = await storeProductService.findAndCount(storeProductQuery);
    const MainstoreProductList = storeProductListData && storeProductListData.rows;

    return {
      data: { data: MainstoreProductList, storeData: storeData },
    };
  } catch (err) {
    console.log(err);
    throw { message: err };
  }
};
module.exports = {
  search,
};
