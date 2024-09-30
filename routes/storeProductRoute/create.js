/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require('../../helpers/Response');

// Services
const locationProductService = require('../../services/locationProductService');
const { storeProduct } = require('../../db').models;
const ProductService = require('../../services/ProductService');

/**
 * Store product create route
 */
async function create(req, res, next) {
  const data = req.body;
  const companyId = req.user && req.user.company_id;
  const ids = req.body.storeIds.split(',');
  if (ids == '') {
    return res.json(BAD_REQUEST, { message: 'Location Name Required' });
  }

  if (data && !data.productId) {
    return res.json(BAD_REQUEST, { message: 'Product Id Is Required' });
  }

  try {
    const storeProductExist = await storeProduct.findOne({
      where: {
        store_id:ids,
        product_id: data.productId,
        company_id: companyId
      },
    });

    if (storeProductExist) {
      return res.json(BAD_REQUEST, { message: 'Location Name Already Exists' });
    }

    let productDetail = await ProductService.getDetail(data.productId, companyId);

    ids.forEach((id) => {
      const createData = {
        productId: data.productId,
        storeId: id,
        storeProductId: data.storeProductId,
        company_id: companyId,
        min_quantity: productDetail && productDetail.min_quantity,
        max_quantity: productDetail && productDetail.max_quantity,
      };

      locationProductService.createStoreProduct(createData);
    });

    res.json(CREATE_SUCCESS, { message: 'Location added' });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = create;
