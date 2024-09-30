// Utils
const { Op } = require('sequelize');
const { getMediaUrl } = require('../../lib/utils');

// Status
const { BAD_REQUEST } = require('../../helpers/Response');
const DateTime = require('../../lib/dateTime');

// Lib
const Request = require('../../lib/request');

// Constants

const { productIndex, StockEntryProduct, StockEntry, storeProduct } = require('../../db').models;

async function productSearch(req, res, next) {
  const { id } = req.params;

  let companyId = Request.GetCompanyId(req);

  try {
    let { page, pageSize, search, sort, sortDir, pagination, brand, category, store_id } = req.query;

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: 'Product id is required' });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: 'Invalid page size' });
    }

    const storeProductWhere = {};
    if (id) {
      storeProductWhere.stock_entry_id = id;
      storeProductWhere.company_id = companyId;
    }

    const productDetails = await storeProduct.findAll({
      where:{store_id:store_id, company_id:companyId}
    });


    let productIds = [];
    if (productDetails) {
      for(let i= 0; i < productDetails.length; i++){
        let data = productDetails[i]
        let productId = await StockEntryProduct.findOne({where:{ stock_entry_id:id, product_id:data.product_id, company_id:companyId }})
        if(!productId){
          productIds.push(data.product_id)
        }
      }
    }


    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      name: 'product_name',
    };

    const sortParam = sort || 'name';
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort product by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
    }

    const data = req.query;

    const where = {};

    where.company_id = companyId;
    where.product_id = productIds;
  
    // Search by name
    const name = data.name;
    if (name) {
      where.product_name = {
        [Op.like]: `%${name}%`,
      };
    }
    // Search by status
    const status = data.status;
    if (status) {
      where.status = status;
    }
    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          product_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          brand_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const query = {
      distinct: true,
      attributes: { exclude: productIds },
      order: [
        [sortableFields[sortParam], sortDirParam],
        [ "createdAt", "DESC"] ],
      where,
    };

    if (pagination) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }
    const products = await productIndex.findAndCountAll(query);
    // Return products is null
    if (products.count === 0) {
      return res.json({});
    }
    const Data = [];
    products.rows.forEach((productDetails) => {
      const {
        product_id,
        product_name,
        size,
        unit,
        sale_price,
        brand_name,
        category_name,
        status,
        featured_media_url,
        max_quantity,
        min_quantity,
        quantity,
        mrp,
        product_display_name,
        createdAt,
        updatedAt,
      } = productDetails;
      const product = {
        id: product_id,
        name: product_name,
        brand: brand_name,
        size: size,
        unit: unit,
        category: category_name,
        sale_price: sale_price,
        image: featured_media_url,
        mrp: mrp,
        status: status,
        quantity: quantity,
        min_quantity: min_quantity,
        max_quantity: max_quantity,
        product_display_name: product_display_name,
      };
      product.createdAt = DateTime.defaultDateFormat(createdAt);
      product.updatedAt = DateTime.defaultDateFormat(updatedAt);
      Data.push(product);
    });
    res.json({
      totalCount: products.count,
      currentPage: page,
      pageSize,
      data: Data ? Data : [],
      sort,
      sortDir,
      search,
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = productSearch;
