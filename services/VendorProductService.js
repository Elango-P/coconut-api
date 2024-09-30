/**
 * Module dependencies
 */
const util = require("../lib/Url");
const { Op } = require("sequelize");

const DateTime = require("../lib/dateTime");
const {
  VENDOR_BIGBASKET_URL,
  VENDOR_JIOMART_URL,
} = require("../helpers/VendorImport");

// Models
const { vendorProduct, supplierProductMedia, Location, Media, product, productIndex } = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");
const vendorProductService = new DataBaseService(vendorProduct);
// Services
const productService = require("./ProductService");

const { getProductBrandId } = require("./ProductBrandService");
const { getProductCategoryId } = require("./ProductCategoryService");
const accountService = require("./AccountService");
const bigbasketImport = require("./import/bigBasket");
const jiomartImport = require("./import/jioMart");
const { getMediaUrl } = require("../lib/utils");

/**
 * Scrape Vendor product details page
 *
 * @param {*} url
 * @param {*} vendorUrl
 */
const getVendorProductFromUrl = async (url, supplierUrl, companyId) => {
  const SUPPLIER_URL = supplierUrl.toLowerCase();

  try {
    if (SUPPLIER_URL.includes(VENDOR_BIGBASKET_URL)) {
      return await bigbasketImport(url);
    } else if (SUPPLIER_URL.includes(VENDOR_JIOMART_URL)) {
      return await jiomartImport(url);
    } else {
      throw { message: "Vendor import not found" };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getProductFromUrl = async (url, companyId) => {

  try {
    if (url.includes(VENDOR_BIGBASKET_URL)) {
      return await bigbasketImport(url);
    } else if (url.includes(VENDOR_JIOMART_URL)) {
      return await jiomartImport(url);
    } else {
      throw { message: "Vendor import not found" };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
/**
 * Check whether vendor product exist or not
 *
 * @param {*} vendorProductId
 * @returns {*} false if not exist else product details
 */
const isExist = async (vendorProductId, companyId) => {
  try {
  const productDetails = await vendorProduct.findOne({
    where: { id: vendorProductId, company_id: companyId },
  });

  if (!productDetails) {
    return false;
  }

  return productDetails;
}catch(err){
  console.log(err);
}
};

/**
 * Find all vendor product by Ids
 *
 * @param {Array} ids
 * @returns array of products
 */
const findAllProducts = async (id, companyId) => {

  try {
  if (!id) {
    throw { message: "Please Select a Product" };
  }

  const products = await vendorProduct.findAll({
    where: { vendor_id: id, company_id: companyId },
  });

  if (!products.length) {
    throw { message: "Product not found" };
  }

  return products;
}catch(err){
  console.log(err);
}
};

/**
 * Get vendor product details by id
 *
 * @param {*} vendorProductId
 */
const getVendorProductById = async (vendorProductId, companyId) => {
  try {
  if (!vendorProductId) {
    throw { message: "vendor product id is required" };
  }

  const productDetails = await vendorProduct.findOne({
    where: { id: vendorProductId, company_id: companyId },
    attributes: { exclude: ["deletedAt"] },
    include: [
      {
        required: false,
        model: supplierProductMedia,
        as: "supplierProductImages",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    ],
  });

  if (!productDetails) {
    throw { message: "Vendor product not found" };
  }

  const { price, supplierProductImages, createdAt, updatedAt } = productDetails;
  const data = { ...productDetails.get() };
  delete data.supplierProductMedia;

  let images = [];
  if (supplierProductImages && supplierProductImages.length > 0) {
    supplierProductImages.forEach((image) => {
      images.push(image.image_url);
    });
  }

  // formate object property
  data.images = images;
  data.price = price;
  data.createdAt = DateTime.defaultDateFormat(createdAt);
  data.updatedAt = DateTime.defaultDateFormat(updatedAt);

  return data;
} catch (err){
  console.log(err);
}
};

/**
 * Update vendor product image
 *
 * @param {*} vendorProductId
 * @param {*} image
 */
const updateProductImage = async (vendorProductId, image, companyId) => {

  try {
  // Delete existing vendor product images
  await supplierProductMedia.destroy({
    where: { supplier_product_id: vendorProductId },
  });

  let position = 0;

  if (image && image.length > 0) {
    for (let i = 0; i < image.length; i++) {
      // Create vendor product image
      const productImage = {
        supplier_product_id: vendorProductId,
        image_url: image[i],
        company_id: companyId,
        position: ++position,
      };

      await supplierProductMedia.create(productImage);
    }
  }

  return true;
  } catch (err){
    console.log(err);
  }

};

/**
 * Update product details in master product
 *
 * @param {*} currentDetails
 * @param {*} newDetails
 */
const updateInMasterProduct = async (currentDetails, newDetails) => {
  try {
  const updateData = {};

  if (
    newDetails.price &&
    currentDetails.price !== parseFloat(newDetails.price, 10)
  ) {
    updateData.price = newDetails.price;
  }

  if (
    newDetails.sale_price &&
    currentDetails.sale_price !== parseInt(newDetails.sale_price, 10)
  ) {
    updateData.sale_price = newDetails.sale_price;
  }

  if (Object.keys(updateData).length) {
    await productService.updateProducts(currentDetails.product_id, updateData);
  }
} catch (err){
  console.log(err);
}
};

/**
 * Update vendor product details
 *
 * @param {*} id
 * @param {*} data
 */
const updateProduct = async (id, data, companyId) => {
  try {
  if (!id) {
    throw { message: "Vendor Product Name Is Required" };
  }

  const productExist = await isExist(id, companyId);

  if (!productExist) {
    throw { message: "Vendor product  not found" };
  }

  if (data.brandName) {
    data.brandId = await getProductBrandId(data.brandName, companyId);
  }

  if (data.categoryName) {
    data.categoryId = await getProductCategoryId(data.categoryName, companyId);
  }
  const updateProductData = {
    name: data.name,
    vendor_id: data.supplierId,
    description: data.description,
    product_id: data.productId,
    price: data.price,
    sale_price: data.salePrice,
    vendor_url: data.url,
    status: data.status,
    barcode: data.barcode,
    brand_id: data.brandId,
    category_id: data.categoryId,
    last_updated_at: data.lastUpdatedAt,
    import_status: data.importStatus,
    imported_at: data.importedAt,
    company_id: companyId,
  };

  const productDetails = await vendorProduct.update(updateProductData, {
    where: { id },
  });

  if (data.images && data.images.length > 0) {
    productDetails.images = await updateProductImage(id, data.images, companyId);
  }

  if (productExist.product_id)
    await updateInMasterProduct(productExist, updateProductData);

  return productDetails;
} catch (err){
  console.log(err);
}
};

/**
 *  Create new vendor product
 *
 * @param {*} data
 */
const createProductVendor = async (data) => {
  try {
  if (!data) {
    throw { message: "Vendor product details is required" };
  }

  let vendorDetail = await vendorProduct.findOne({where:{
    product_id: data.productId,
    company_id: data.company_id,
    vendor_id: data.vendorId,
  }});

  if(vendorDetail){
     throw { message: "Vendor Product Already Exist" };
  }
  if(!vendorDetail){
    const createData = {
      product_id: data.productId,
      company_id: data.company_id,
      name: data.name ? data.name : "",
      sale_price: data.sale_price ?  data.sale_price : null,
      brand_id: data.brand_id,
      category_id: data.category_id,
      vendor_id: data.vendorId,
    };
  
    const storeProductDetails = await vendorProduct.create(createData);
    return storeProductDetails;
  }
} catch (err){
  console.log(err);
}
};

/**
 * Create new vendor product
 *
 * @param {*} data
 */
const createProduct = async (data, companyId) => {
  try {
  const supplierUrl = util.removeQueryStringFromUrl(data.url);

  // Validate vendor url is exist
  const exist = await vendorProduct.findOne({
    where: { vendor_url: supplierUrl, company_id: companyId },
  });
  if (exist) {
    throw { message: "Vendor product already exist", exist };
  }

  if (data.brandName) {
    data.brandId = await getProductBrandId(data.brandName, companyId);
  }

  if (data.categoryName) {
    data.categoryId = await getProductCategoryId(data.categoryName, companyId);
  }
  if (data.vendorBaseUrl) {
    data.vendorId = await accountService.getVendorId(
      data.vendorBaseUrl,
      companyId
    );
  }

  const createProductData = {
    name: data.name,
    vendor_id: data.vendorId || null,
    description: data.description,
    product_id: data.productId,
    price: data.price || null,
    sale_price: data.salePrice || null,
    vendor_url: supplierUrl,
    status: data.status,
    barcode: data.barcode,
    brand_id: data.brandId,
    category_id: data.categoryId,
    last_updated_at: data.lastUpdatedAt,
    import_status: data.importStatus,
    imported_at: data.importedAt,
    company_id: companyId,
  };

  const product = await vendorProduct.create(createProductData);
  if (data.images && data.images.length > 0) {
    product.images = await updateProductImage(
      product.id,
      data.images,
      companyId
    );
  }

  return product;
} catch (err){
  console.log(err);
}
};

/**
 * Delete vendor product by id
 *
 * @param {*} id
 */
const deleteProduct = async (id, companyId) => {
  try {
  if (!id) {
    throw { message: "Vendor product id is required" };
  }

  // Validate vendor product
  const exist = await isExist(id, companyId);
  if (!exist) {
    throw { message: "Vendor product  not found" };
  }

  return await vendorProduct.destroy({ where: { id } });
} catch (err){
  console.log(err);
}
};

/**
 * Check whether vendor product exist or not by name
 *
 * @param {*} vendorProductName
 * @returns {*} false if not exist else product details
 */
const isExistByName = async (vendorProductName, companyId) => {
  try {
  const productDetails = await vendorProduct.findOne({
    where: { name: vendorProductName, company_id: companyId },
  });

  if (!productDetails) {
    return false;
  }

  return productDetails;
}catch (err){
  console.log(err);
}
};

/**
 *  Create Vendor Product
 *
 * @param {*} data
 */
const createVendorProduct = async (data, companyId) => {
  try {
  const name = data.name;
  const status = data.status;
  const vendorProductDetails = await isExistByName(name, companyId);
  if (vendorProductDetails) {
    throw { message: "Vendor product  already exist", vendorProductDetails };
  }

  const createData = {
    name,
    status: status,
    company_id: companyId,
  };

  const vendorProductData = await vendorProduct.create(createData);

  return vendorProductData;
} catch (err) { 
console.log(err);
}
};

const searchVendorProduct = async (params, companyId) => {
  try{
  let { page, pageSize, search, sort, sortDir, pagination, productId, code } = params;

  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    throw { message: "Invalid page" };
  }

  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    throw { message: "Invalid page size" };
  }

  // Sortable Fields
  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    id: "id",
    product_id: "product_id",
    name: "name",
    vendor_id: "vendor_id",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  };

  const sortParam = sort ? sort : "vendor_id";
  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    throw { message: `Unable to sort store by ${sortParam}` };
  }

  const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";

  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    throw { message: "Invalid sort order" };
  }

  let where = {};

  let productWhere = new Object();

  where.company_id = companyId;
  // Search term
  const searchTerm = search ? search.trim() : null;

  whereProduct = {};
  whereStore = {};
  if (searchTerm) {
    where[Op.or] = [
      {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    ];
  }
  if (params.brand) {
    whereProduct.brand_id = params.brand.split(",")
  }
  if (params.category) {
    whereProduct.category_id = params.category.split(",")
  }
  // Search by product id
  if (productId) {
    where.product_id = productId;
  }

  // Search by store id
  if (params.vendor_id) {
    where.vendor_id = params.vendor_id;
  }

  if (code) {
    productWhere.barcode = code;
  }

  const query = {
    distinct: true,
    attributes: { exclude: ["deletedAt"] },
    where,
    order: [
      [sortableFields[sortParam], sortDirParam],
    ],
    where,
    include: [
      {
        required: true,
        model: product,
        as: "product",
        where: whereProduct,
      },
      {
        required: true,
        model: productIndex,
        as: "productIndex",
        where: productWhere
      },
    ],
  };

  if (pagination) {
    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }
  // Get store list and count
  const storeProducts = await vendorProduct.findAndCountAll(query);
  // Return store is null
  if (storeProducts.count === 0) {
    return { data: [] };
  }

  const storeProductData = [];

  storeProducts.rows.forEach((storeProduct) => {
    const data = { ...storeProduct.get() };
    data.productIndex.forEach((product) => {
      data.brandName= product.brand_name;
      data.image = product.featured_media_url || null;
      data.mrp = product.mrp;
    })

    storeProductData.push(data);
  });

  return {
    totalCount: storeProducts.count,
    currentPage: page,
    pageSize,
    data: storeProductData,
    sort,
    sortDir,
    search,
    store_id: params.store_id,
  };
} catch (err){
  console.log(err);
}
};

const updateProductPrice = async (unit_price,productId,vendorId,companyId) => {
 try{
      await vendorProductService.update(
        { price: unit_price },
        { where: { product_id: productId,vendor_id:vendorId ,company_id: companyId } }
      );
 }catch(err){
  console.log(err);
 }
};

module.exports = {
  getVendorProductFromUrl,
  getProductFromUrl,
  isExist,
  findAllProducts,
  getVendorProductById,
  updateProduct,
  createProductVendor,
  createProduct,
  deleteProduct,
  searchVendorProduct,
  createVendorProduct,
  updateProductPrice
};
