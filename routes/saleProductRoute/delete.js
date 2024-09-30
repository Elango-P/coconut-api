// Models
const { SaleProduct } = require('../../db').models;
const saleProductService = require('../../services/SaleProductService');

const del = async (req, res) => {
    const { id } = req.params;
    try {
    //get sale product entry Id

    //get company Id from request
    const companyId = Request.GetCompanyId(req);

    //validate sale product entry Id exist or not
    if (!id) {
      return res.json(400, { message: 'Sale Product Id is required' });
    }

    //validate sale product exist or not
    let isSaleProductExist = await SaleProduct.findOne({
      where: { company_id: companyId, id: id },
    });

    //validate sale product exist or not
    if (!isSaleProductExist) {
      return res.json(400, { message: 'Sale Product Not Found' });
    }

    //delete the sale product
    await SaleProduct.destroy({ where: { company_id: companyId, id: id } });
    res.on('finish', async () => {
      //create system log for sale updation
      History.create(`Sale Deleted`, req,ObjectName.SALE_SETTLEMENT_PRODUCT,id);

    });
    res.json(200, { message: 'Sale Product  Deleted' });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = del;
