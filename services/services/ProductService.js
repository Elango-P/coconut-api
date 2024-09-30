const Product = require("../../helpers/Product");

const {
 
    Media: MediaModel,
    productCategory,
    productBrand,
    productIndex,
     } = require("../../db").models;
  


const getProductDetailsById = async (productId, companyId) => {
    try {
      if (!productId) {
        throw { message: "Product id is required" };
      }
  
      const productDetail = await productIndex.findOne({
        include: [
          {
            required: false,
            model: productCategory,
            as: "productCategory",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            required: false,
            model: productBrand,
            as: "productBrand",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
  
          {
            required: false,
            model: MediaModel,
            as: "media",
  
            where: { company_id: companyId },
          },
        ],
        where: { product_id: productId, company_id: companyId },
      });
  
      // Product Not Found
      if (!productDetail) {
        throw { message: "Product not found" };
      }
  
      const {
        product_name,
        mrp,
        sale_price,
        taxable,
        status,
        description,
        shopify_product_id,
        weight,
        weight_unit,
        quantity,
        shopify_quantity,
        sku,
        slug,
        allow_sell_out_of_stock,
        store_id,
        featured_media_url,
        size,
        unit,
        cgst_percentage,
        sgst_percentage,
        cgst_amount,
        sgst_amount,
        igst_percentage,
        tax_percentage,
        cost,
        discount_percentage,
        margin_percentage,
        reward,
        shelf_life,
        rack_number,
      } = productDetail;
      const productTags = [];
      const productImage = [];
      productDetail &&
        productDetail.productTag &&
        productDetail.productTag.forEach((tagType) => {
          productTags.push(tagType.tag.name);
        });
  
     
      const productCategoryName =
        productDetail && productDetail.productCategory
          ? productDetail.productCategory.name
          : "";
      const productBrandName =
        productDetail && productDetail.productBrand
          ? productDetail.productBrand.name
          : "";
      const productTagNames = productTags.join(",");
      const sellOutOfStockLabel = allow_sell_out_of_stock
        ? Product.PRODUCT_SELL_OUT_OF_STOCK_POLICY_CONTINUE
        : Product.PRODUCT_SELL_OUT_OF_STOCK_POLICY_DENY;
  
      const data = {
        product_name,
        slug,
        productCategoryName,
        productBrandName,
        productTagNames,
        mrp,
        sale_price,
        description,
        weight,
        weight_unit,
        shopify_quantity,
        sku,
        sellOutOfStockLabel,
        taxable: taxable ? true : false,
        status: status === Product.PRODUCT_SHOPIFY_STATUS_PUBLISHED ? true : false,
        shopify_product_id,
        quantity,
        store_id,
        featured_media_url,
        size,
        unit,
        image: productImage,
        cgst_percentage,
        sgst_percentage,
        cgst_amount,
        sgst_amount,
        igst_percentage,
        tax_percentage,
        cost,
        discount_percentage,
        margin_percentage,
        brand_id:  productDetail && productDetail?.productBrand && productDetail?.productBrand?.id,
        category_id:  productDetail && productDetail?.productCategory && productDetail?.productCategory?.id,
        reward: reward ? reward :"",
        shelf_life : shelf_life ? shelf_life : "",
        rack_number : rack_number ? rack_number : "",
      };
  
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  module.exports = {
    getProductDetailsById,
   
  };
  