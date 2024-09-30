/**
 * Module dependencies
 */
const { Op } = require("sequelize");
const async = require("async");
const productImageService = require("./productImageService");

// Utils
const { getS3ObjectUrl } = require("../lib/utils");

const {
  STORE_PRODUCT_EXPORT_STATUS_PENDING,
} = require("../helpers/StoreProduct");

const storeProductService = require("./storeProductService");

const Product = require("../../helpers/Product");

// Constants
const {
  PRODUCT_IMAGE_PATH,
  PRODUCT_IMAGE_SHOPIFY_STATUS_NEW,
  PRODUCT_IMAGE_SHOPIFY_STATUS_PENDING,
  PRODUCT_IMAGE_STATUS_INACTIVE,
  PRODUCT_IMAGE_SHOPIFY_STATUS_EXPORTED,
  PRODUCT_IMAGE_STATUS_ACTIVE,
} = require("../helpers/ProductImage");

// Services
const {
  updateProduct,
  createProductImage,
  updateProductImage,
  deleteProductImage,
} = require("./shopify");

const {
  product,
  product_tag,
  product_media,
  product_category,
  product_brand,
  tag,
} = require("../../db").models;

/**
 * Check whether product exist or not
 *
 * @param {*} productId
 * @returns {*} false if not exist else product details
 */
const isExist = async (productId) => {
  if (!productId) {
    return callback({ message: "Product id is required" });
  }

  const productDetails = await product.findOne({
    where: { id: productId },
  });

  if (!productDetails) {
    return false;
  }

  return productDetails;
};

/**
 * Create Product
 *
 * @param data
 * @param callback
 */
export const createProduct = (data, callback) => {
  product.findOne({ where: { name: data.name } }).then((productDetails) => {
    // If Product Name is Already Exists
    if (productDetails) {
      return callback({ message: "Product name is already exist" });
    }

    const {
      name,
      type_name,
      brand_name,
      slug,
      images,
      description,
      category_id,
      brand_id,
      sell_out_of_stock,
    } = data;

    // Create Product Data
    const productCreateData = {
      name,
      brand_name,
      type_name,
      slug,
      description,
      category_id,
      brand_id,
      sell_out_of_stock,
    };

    // Create Product
    product
      .create(productCreateData)
      .then((result) => {
        const productId = result.id;

        productImageService.createProductImage(
          productId,
          images,
          name,
          (err) => {
            if (!err) {
              return callback(null, productId);
            }

            return product
              .destroy({ where: { id: productId } })
              .then(() => callback(err, productId));
          }
        );
      })
      .catch((err) => callback(err));
  });
};

/**
 * Update product tag types
 *
 * @param {*} productId
 * @param {*} productTagType
 */
const updateProductTag = async (productId, productTagType) => {
  // Delete existing product tags
  await product_tag.destroy({
    where: { product_id: productId },
    truncate: true,
  });

  // Create new product tags
  for (let tag of productTagType) {
    const { tagId } = tag;
    tagId &&
      (await product_tag.create({
        product_id: productId,
        tag_id: tagId,
      }));
  }
};

/**
 * Update Product
 *
 * @param productId
 * @param data
 * @param callback
 * @returns {*}
 */
export const updateProducts = async (productId, data, callback) => {
  let errorMessage;

  if (!productId) {
    errorMessage = { message: "Master product id not found" };
    if (callback) return callback(errorMessage);

    throw errorMessage;
  }

  const productDetails = await isExist(productId);

  if (!productDetails) {
    errorMessage = { message: "Master product not found" };
    if (callback) return callback(errorMessage);

    throw errorMessage;
  }

  const updateData = {
    store_id: data.store_id,
    slug: data.slug,
    sku: data.sku,
    description: data.description,
    weight: data.weight,
    weight_unit: data.weight_unit,
    price: data.price,
    quantity: data.quantity,
    taxable: data.taxable,
    notes: data.notes,
    status: data.status,
    shopify_product_id: data.shopify_product_id,
    barcode: data.barcode,
    brand_id: data.brand_id,
    sell_out_of_stock: data.sell_out_of_stock,
    category_id: data.category_id,
    tax: data.tax,
    shopify_quantity: data.shopify_quantity,
  };

  if (data.name) updateData.name = data.name;

  const save = await product.update(updateData, {
    where: { id: productId },
    returning: true,
  });

  if (data.productTagType)
    await updateProductTag(productId, data.productTagType);

  // update store_product export_status as PENDING
  await storeProductService.updateAllStoreProductByProductId(productId, {
    exportStatus: STORE_PRODUCT_EXPORT_STATUS_PENDING,
  });

  callback && callback();
};

/**
 * Get product details by product id
 *
 * @param {*} productId
 * @param {*} storeId
 */
const getProductDetails = async (productId, storeId) => {
  if (!productId) {
    throw { message: "Product id is required" };
  }

  const productDetail = await product.findOne({
    include: [
      {
        required: false,
        model: product_category,
        as: "productCategory",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
      {
        required: false,
        model: product_brand,
        as: "productBrand",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
      {
        required: false,
        model: product_tag,
        as: "productTag",
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            required: false,
            model: tag,
            as: "tag",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      },
    ],
    where: { id: productId },
  });

  // Product Not Found
  if (!productDetail) {
    throw { message: "Product not found" };
  }

  const {
    id,
    name,
    price,
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
    productCategory,
    productBrand,
    productTag,
    sell_out_of_stock,
    store_id,
  } = productDetail;

  const productTags = [];
  productTag &&
    productTag.forEach((tagType) => {
      productTags.push(tagType.tag.name);
    });

  const productCategoryName = productCategory ? productCategory.name : "";
  const productBrandName = productBrand ? productBrand.name : "";
  const productTagNames = productTags.join(",");
  const sellOutOfStockLabel = sell_out_of_stock
    ? Product.PRODUCT_SELL_OUT_OF_STOCK_POLICY_CONTINUE
    : Product.PRODUCT_SELL_OUT_OF_STOCK_POLICY_DENY;

  const data = {
    name,
    slug,
    productCategoryName,
    productBrandName,
    productTagNames,
    price,
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
  };

  return data;
};

/**
 * Export product images in shopify
 *
 * @param {*} storeId
 * @param {*} shopifyProductId
 * @param {*} images
 */
function exportProductImageInShopify(storeId, shopifyProductId, images) {
  if (!images.length) {
    return null;
  }

  async.eachSeries(images, (image, cb) => {
    const imageData = {
      src: image.src,
      position: image.position,
      alt: image.alt,
    };

    if (image.status === PRODUCT_IMAGE_STATUS_INACTIVE) {
      return cb();
    }

    createProductImage(storeId, shopifyProductId, imageData);
  });
}

/**
 * Update product image in shopify
 *
 * @param {*} storeId
 * @param {*} shopifyProductId
 * @param {*} images
 */
function updateProductImageInShopify(storeId, shopifyProductId, images) {
  if (!images.length) {
    return null;
  }

  for (let image of images) {
    const imageData = {
      src: image.src,
      position: image.position,
      alt: image.alt,
    };

    const updateImage =
      image.shopifyStatus === PRODUCT_IMAGE_SHOPIFY_STATUS_PENDING &&
      image.status === PRODUCT_IMAGE_STATUS_ACTIVE;

    const createImage =
      image.shopifyStatus === PRODUCT_IMAGE_SHOPIFY_STATUS_NEW &&
      image.status === PRODUCT_IMAGE_STATUS_ACTIVE;

    const deleteImage =
      image.status === PRODUCT_IMAGE_STATUS_INACTIVE &&
      image.shopifyStatus === PRODUCT_IMAGE_SHOPIFY_STATUS_PENDING;

    if (!image.shopifyStatus) {
      continue;
    }

    // Update image
    else if (updateImage) {
      deleteProductImage(storeId, shopifyProductId, image.shopifyId, () => {
        createProductImage(storeId, shopifyProductId, imageData);
      });
    }

    // Create new image
    else if (createImage || (!image.shopifyId && createImage)) {
      createProductImage(storeId, shopifyProductId, imageData);
    }

    // Delete image
    else if (deleteImage) {
      deleteProductImage(storeId, shopifyProductId, image.shopifyId);
    }
  }
}

export default {
  isExist,
  createProduct,
  updateProducts,
  getProductDetails,
  updateProductImageInShopify,
  exportProductImageInShopify,
};
