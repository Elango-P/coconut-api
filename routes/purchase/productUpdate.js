const { BAD_REQUEST } = require('../../helpers/Response');
const Number = require('../../lib/Number');
const Request = require('../../lib/request');

const validator = require('../../lib/validator');
const PurchaseProductService = require("../../services/services/PurchaseProductService");
const ProductService = require("../../services/services/ProductService");
const StatusService = require("../../services/StatusService");
const Status = require('../../helpers/Status');
const ProductPriceService = require('../../services/ProductPriceService');
const { reindex } = require('../../services/ProductService');
const ObjectName = require("../../helpers/ObjectName");

// Model
const { Purchase, PurchaseProduct, storeProduct ,AccountProductModel } = require('../../db').models;

const productupdate = async (req, res) => {
  try {
    let data = req.body;
    const purchaseProductId = req.params.id;
    let company_id = Request.GetCompanyId(req);

    if (!purchaseProductId) {
      return res.json(BAD_REQUEST, { message: 'Purchase Product Id Is Required' });
    }

    let purchaseProductDetail = await PurchaseProduct.findOne({
      where: {
        id: purchaseProductId,
        company_id: company_id,
      },
    });

    if (!purchaseProductDetail) {
      return res.json(400, { message: 'Purchase Product Not Found' });
    }
    let productData = await ProductService.getProductDetailsById(purchaseProductDetail?.product_id,company_id);

    let unit_price =
      data && data.unit_price ? parseFloat(data.unit_price, 10) : data.net_amount  / (data.quantity * productData.pack_size);


      let igst_amount = data.igst_amount && !isNaN(data.igst_amount) ? Number.Decimal(data.igst_amount) :0
      let cgst_amount = data.cgst_amount && !isNaN(data.cgst_amount) ? Number.Decimal(data.cgst_amount) :0
      let sgst_amount = data.sgst_amount && !isNaN(data.sgst_amount) ? Number.Decimal(data.sgst_amount) :0
      let cess_amount = data.cess_amount && !isNaN(data.cess_amount) ? Number.Decimal(data.cess_amount) :0


    let updateData = {};

 

    if (data.tax_percentage) { updateData.tax_percentage = Number.GetFloat(data.tax_percentage) }

     updateData.tax_amount = igst_amount + cgst_amount + sgst_amount + cess_amount;

    if (data.net_amount || data.amount) { updateData.net_amount = data.net_amount ? Number.GetFloat(data.net_amount) : Number.GetFloat(data.amount) }

    if (data.discount_amount) { updateData.discount_amount = Number.GetFloat(data.discount_amount) }

   updateData.quantity = Number.GetFloat(data.quantity) 

    if (data.cess_amount) { updateData.cess_amount = Number.GetFloat(data.cess_amount) }

    if (Number.isNotNull(data.cess_percentage)) { updateData.cess_percentage = (data.cess_percentage) }

    if (data.sgst_amount) { updateData.sgst_amount = Number.GetFloat(data.sgst_amount) }

    if (Number.isNotNull(data.sgst_percentage)) { updateData.sgst_percentage = (data.sgst_percentage) }

    if (data.cgst_amount) { updateData.cgst_amount = Number.GetFloat(data.cgst_amount) }
    if (data.taxable_amount) { updateData.taxable_amount = Number.GetFloat(data.taxable_amount) }

    if (Number.isNotNull(data.cgst_percentage)) { updateData.cgst_percentage = (data.cgst_percentage) }
    
    if (Number.isNotNull(data.igst_percentage)) { updateData.igst_percentage = (data.igst_percentage) }
    if (data.igst_amount) { updateData.igst_amount = Number.GetFloat(data.igst_amount) }
     updateData.mrp = Number.GetFloat(data.mrp) 

    if (data.unit_price) { updateData.unit_price = Number.GetFloat(unit_price); }

    if (data.manufactured_date) { updateData.manufactured_date = data.manufactured_date }

    if (data.status) { updateData.status = data.status }

    if (data.discount_percentage) { updateData.discount_percentage = Number.GetFloat(data.discount_percentage) }
    
      updateData.margin_percentage =data.margin_percentage
      updateData.unit_margin_amount =  data.unit_margin_amount
      updateData.margin_amount =  data.margin_amount
    await PurchaseProduct.update(updateData, {
      where: {
        id: purchaseProductId,
        company_id: company_id,
      },
    });

    
    if(purchaseProductDetail && purchaseProductDetail.status != data.status){
      let statusDetail = await StatusService.getData(data.status, company_id)

    if (validator.isNotEmpty(data.quantity) && statusDetail && statusDetail.update_quantity_in_location_product == Status.UPDATE_QUANTITY_IN_LOCATION_PRODUCT_ENABLED) {

      let storeProductDetails = await storeProduct.findOne({
        where: {  
          company_id : company_id,
          store_id : purchaseProductDetail.store_id, 
          product_id : purchaseProductDetail.product_id
        }
      });
      if (storeProductDetails) {
        
        let updatedQuantity =  Number.Get(storeProductDetails.quantity, 0) + (Number.Get(data.quantity,0));

        await storeProduct.update({ quantity: updatedQuantity },
          {
            where: {
              product_id: purchaseProductDetail.product_id,
              store_id: purchaseProductDetail.store_id,
              company_id: company_id
            }
          })
      }
    }
    if (statusDetail && statusDetail.update_product_price == Status.UPDATE_PRODUCT_PRICE_ENABLED) {
      let purchaseDetail = await Purchase.findOne({
        where: {
          id: purchaseProductDetail.purchase_id,
          company_id: company_id
        }
      });
      let param={
        productId: purchaseProductDetail && purchaseProductDetail.product_id,
        companyId:company_id,
        unitPrice: purchaseProductDetail && purchaseProductDetail.unit_price,
        marginAmount: purchaseProductDetail && purchaseProductDetail.unit_margin_amount,
        barcode:purchaseProductDetail && purchaseProductDetail.barcode,
        mrp:purchaseProductDetail && purchaseProductDetail.mrp,
        date:purchaseDetail && purchaseDetail.purchase_date
      }
     let response =  await ProductPriceService.updatePrice(param)
      if (response.historyMessage && response.historyMessage.length > 0) {
        let message =response.historyMessage.join();
        History.create(message, req,  ObjectName.PRODUCT, purchaseProductDetail && purchaseProductDetail?.product_id);
      }
      await  reindex(response?.productId, company_id);
    }
  }

    res.json(200, { message: 'Purchase Data Updated' });
    res.on('finish', async () => {
      await PurchaseProductService.createAuditLog(purchaseProductDetail,data,req)
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = productupdate;
