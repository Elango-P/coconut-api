const ObjectName = require("../../helpers/ObjectName");
const { purchaseProduct } = require("../../helpers/purchaseProduct");
const ArrayList = require("../../lib/ArrayList");
const Number = require("../../lib/Number");
const Request = require("../../lib/request");
const History = require("../../services/HistoryService");

const { productIndex, PurchaseProduct, AccountProductModel } = require("../../db").models;

const productBulkupdate = async (req, res, next) => {
  let data = req.body;
  try {
    if (Number.isNull(data.productIds)) {
      return res.json(400, { message: "Select Product(s)" });
    }

    let companyId = Request.GetCompanyId(req);
    let productIds = ArrayList.StringIntoArray(data.productIds);

    const getPurchaseData = (productDetail, purchaseProductData) => {
      let totalTax =
      Number.GetFloat(productDetail?.cgst_percentage || 0) +
      Number.GetFloat (productDetail?.sgst_percentage || 0) +
      Number.GetFloat (productDetail?.tax_percentage || 0) +
      Number.GetFloat (productDetail?.igst_percentage || 0) || 0;

      let quantityValue = purchaseProductData.quantity;

      let amount = purchaseProductData && purchaseProductData?.net_amount / quantityValue;

    
      let TaxableAmnt =  purchaseProductData && purchaseProductData?.net_amount
      ? Number.GetFloat(purchaseProductData?.net_amount / (1 + totalTax / 100))
      : "";

      let mrpValue = purchaseProductData && purchaseProductData?.mrp ?purchaseProductData?.mrp:productDetail?.mrp && Number.GetFloat(productDetail.mrp);

      let cgst_percentage = productDetail?.cgst_percentage && Number.GetFloat(productDetail.cgst_percentage);

      let sgst_percentage = productDetail?.sgst_percentage && Number.GetFloat(productDetail.sgst_percentage);

      let cess_percentage = productDetail?.tax_percentage && Number.GetFloat(productDetail.tax_percentage);

      let igst_percentage = productDetail?.igst_percentage && Number.GetFloat(productDetail.igst_percentage);

      let cgstAmount = cgst_percentage && Number.GetFloat(TaxableAmnt * cgst_percentage) / 100;

      let igstAmount = igst_percentage && Number.GetFloat(TaxableAmnt * igst_percentage) / 100;

      let sgstAmount = sgst_percentage && Number.GetFloat(TaxableAmnt * sgst_percentage) / 100;

      let cessAmount = cess_percentage && Number.GetFloat (TaxableAmnt * cess_percentage) / 100;

      let totalTaxAmount =
      Number.GetFloat(cgstAmount) +
      Number.GetFloat(sgstAmount) +
      Number.GetFloat(cessAmount) +
      Number.GetFloat(igstAmount) || 0;

      let totalAmount = Number.GetFloat(amount) + Number.GetFloat(totalTaxAmount);

      const preTaxValue =  Number.GetFloat(amount/ (1 + totalTax / 100)) || "";

      let taxable_amount = preTaxValue * quantityValue || 0;

      let marginValue = mrpValue - amount;

      let unitMarginAmount = (marginValue / mrpValue) * 100;

      let manufactured_date =
        purchaseProductData && purchaseProductData.manufactured_date ? purchaseProductData.manufactured_date : null;

      let statusValue = Number.Get(purchaseProductData.status);

      let vendorId = Number.Get(purchaseProductData.vendor_id);

      let data = {
        quantity: Number.GetFloat(quantityValue),
        mrp: Number.GetFloat(mrpValue),
        unit_price: Number.GetFloat(amount),
        cgst_percentage: cgst_percentage,
        sgst_percentage: sgst_percentage,
        igst_percentage: igst_percentage,
        cess_percentage: cess_percentage,
        tax_amount: Number.GetFloat(totalTaxAmount),
        taxable_amount: Number.GetFloat(taxable_amount),
        cgst_amount: Number.GetFloat(cgstAmount),
        sgst_amount: Number.GetFloat(sgstAmount),
        cess_amount: Number.GetFloat(cessAmount),
        igst_amount: Number.GetFloat(igstAmount),
        amount: Number.GetFloat(totalAmount),
        unit_margin_amount: Number.GetFloat(marginValue),
        margin_amount: Number.GetFloat(marginValue),
        margin_percentage: Number.GetFloat(unitMarginAmount),
        manufactured_date: manufactured_date,
        status: statusValue,
        vendorId: vendorId,
      };

      return data;
    };

    if (productIds && productIds.length > 0) {
      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];

        const productDetails = await productIndex.findOne({
          where: { product_id: productId, company_id: companyId },
          attributes: [
            "id",
            "product_id",
            "cgst_percentage",
            "sgst_percentage",
            "tax_percentage",
            "igst_percentage",
            "mrp",
            "cost",
          ],
        });

        let purchaseProductDetail = await PurchaseProduct.findOne({
          where: {
            purchase_id: data.purchase_id,
            company_id: companyId,
            product_id: productId,
          },
        });

        let purchaseProductData = getPurchaseData(productDetails, purchaseProductDetail);


        if (productDetails && purchaseProductDetail) {
          let updateData = {
            tax_amount: purchaseProductData && purchaseProductData.tax_amount,
            net_amount:
              Number.GetFloat(purchaseProductData && purchaseProductData.tax_amount) +
              Number.GetFloat(purchaseProductData && purchaseProductData.taxable_amount),
            quantity: purchaseProductData && purchaseProductData.quantity,
            cess_amount: purchaseProductData && purchaseProductData.cess_amount,
            cess_percentage: purchaseProductData && purchaseProductData.cess_percentage,
            sgst_amount: purchaseProductData && purchaseProductData.sgst_amount,
            sgst_percentage: purchaseProductData && purchaseProductData.sgst_percentage,
            cgst_amount: purchaseProductData && purchaseProductData.cgst_amount,
            taxable_amount: Number.GetFloat(purchaseProductData && purchaseProductData.taxable_amount),
            cgst_percentage: purchaseProductData && purchaseProductData.cgst_percentage,
            igst_percentage: purchaseProductData && purchaseProductData.igst_percentage,
            igst_amount: purchaseProductData && purchaseProductData.igst_amount,
            mrp: purchaseProductData && purchaseProductData.mrp,
            unit_price: purchaseProductData && purchaseProductData.unit_price,
            manufactured_date: purchaseProductData && purchaseProductData.manufactured_date,
            status: purchaseProductData && purchaseProductData.status,
            margin_percentage: purchaseProductData && purchaseProductData.margin_percentage,
            unit_margin_amount: purchaseProductData && purchaseProductData.unit_margin_amount,
            margin_amount: purchaseProductData && purchaseProductData.margin_amount,
            amount: purchaseProductData && purchaseProductData.amount,
          };
          await PurchaseProduct.update(updateData, {
            where: {
              purchase_id: data?.purchase_id,
              company_id: companyId,
              product_id: productId,
            },
          });
        }
      }
    }
    res.json(200, { message: "Purchase Product Bulk Updated" });
    res.on("finish", async () => {
      History.create("Purchase Product Bulk Updated", req, ObjectName.PURCHASE_PRODUCT);
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = productBulkupdate;
