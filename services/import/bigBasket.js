/**
 * Module dependencies
 */
const cheerio = require("cheerio");
const util = require("../../lib/Url");
const axios = require("axios");

/**
 * Get vendor product MRP
 *
 * @param {*} $ cheerio data
 */
function getProductPrice(productData) {
  // Find the script containing product information

  const productInfo = productData.pricing.discount;

  // Extract MRP and price from product information
  const price = productInfo.prim_price.sp;
  const mrp = productInfo.mrp;

  return { mrp, price };
}

/**
 * Get Vendor product Name
 *
 * @param {*} $ cheerio data
 */
function getProductName($) {
  const jsonLdScript = $('script[type="application/json"]').html();

  const productData = JSON.parse(jsonLdScript);

  let product = productData.props.pageProps.productDetails.children[0];

  let name = `${product.desc}-${product.pack_desc},${product.w}`;

  let brandName = product && product.brand.name;
  let description = product && product.desc;

  let image = product.images;

  return { name, brandName, image, description };
}

/**
 * Get Vendor product image
 *
 * @param {*} $ cheerio data
 */
function getProductImage($) {
  const productNameSelector = "#title h1";
  const productName = $(productNameSelector).text();

  const productImageSelector = `[alt="${productName}"]`;

  let image = "";
  image = $(productImageSelector).attr("src");

  return image;
}

/**
 * Get Vendor product description
 *
 * @param {*} $ cheerio data
 */
function getProductDescription($) {
  const descriptionSelector = "#about_0 ._26MFu";

  let description = "";
  description = $(descriptionSelector).text().trim();

  return description;
}

/**
 * Change vendor product small image URL
 * to large image URL
 *
 * @param {*} url
 */
function changeToLargeImageUrl(url) {
  if (!url) {
    return null;
  }

  return url.replace(/\/p\/s\//, "/p/l/");
}

/**
 * Get Vendor product sub images
 *
 * @param {*} $ cheerio data
 */
function getProductSubImages($) {
  const images = [];
  $("[src]").each((index, element) => {
    const imageSrcSet = $(element).attr("src");

    images.push(imageSrcSet);
  });
  const uniqueImages = {};

  // Filter and remove duplicates
  const filteredImages = images.filter((item) => {
    const imageUrl = item;

    if (imageUrl.includes("www.bigbasket.com")) {
      if (!uniqueImages[imageUrl]) {
        uniqueImages[imageUrl] = true;
        return true;
      }
    }

    return false;
  });
  return filteredImages;
}
/**
 * Get Vendor product type name
 *
 * @param {*} $ cheerio data
 */
function getProductTypeName(productData) {
  if (productData.breadcrumb && productData.breadcrumb.length >= 1) {
    const thirdBreadcrumb = productData.breadcrumb[2];

    return thirdBreadcrumb.name;
  }
}

/**
 * @param {*} url
 */
module.exports = async (url) => {
  try {
    // Validate URL
    if (!url) {
      throw { message: "Vendor product page URL is required" };
    }

    const data = {};

    //Set Vendor
    const baseUrl = util.getBaseUrl(url);
    if (baseUrl) {
      data.vendorBaseUrl = baseUrl;
    }

    const options = {
      url,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const response = await axios(options);
    const $ = cheerio.load(response.data);

    // Find the JSON-LD script tag containing the product data
    const htmlData = $('script[type="application/json"]').html();

    const productData = JSON.parse(htmlData);

    let product = productData.props.pageProps.productDetails.children[0];

    // Get Vendor product Name, brand name
    let name = `${product.desc}-${product.pack_desc},${product.w}`;

    let brandName = product && product.brand.name;
    let description = product && product.desc;

    let image = product.images;

    data.name = name;
    data.brandName = brandName;

    // Get Vendor product type name
    data.typeName = getProductTypeName(product);

    // Get Vendor product MRP, price
    const { mrp, price } = getProductPrice(product);
    data.mrp = mrp;
    data.price = price;

    // Get Vendor product image
    data.image = image;

    // Get Vendor product description
    data.images = getProductSubImages($);

    // Get Vendor product description
    data.description = description;


    return data;
  } catch (err) {
    console.log(err);
  }
};
