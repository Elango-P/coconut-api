/**
 * Module dependencies
 */
const request = require("request-promise");
const cheerio = require("cheerio");
const util = requuire("../../lib/utils");

/**
 * Get vendor product MRP
 *
 * @param {*} $ cheerio data
 */
function getProductPrice($) {
    const mrpSelector = "#price table tbody tr:nth-child(1) td:nth-child(2)";
    const priceSelector = "#price [data-qa='productPrice']";

    let mrp = "";
    mrp = $(mrpSelector)
        .text()
        .replace(/Rs/, "")
        .trim();

    let price = "";
    price = $(priceSelector)
        .text()
        .replace(/Rs/, "")
        .trim();

    return { mrp, price };
}

/**
 * Get Vendor product Name
 *
 * @param {*} $ cheerio data
 */
function getProductName($) {
    const brandNameSelector = "#title a";
    const productNameSelector = "#title h1";

    let name = "";
    name = $(productNameSelector)
        .text()
        .trim();

    let brandName = "";
    brandName = $(brandNameSelector)
        .text()
        .trim();

    return { name, brandName };
}

/**
 * Get Vendor product image
 *
 * @param {*} $ cheerio data
 */
function getProductImage($) {
    const productNameSelector = "#title h1";
    const productName = $(productNameSelector).text();

    const productImageSelector = `[alt='${productName}']`;

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
    description = $(descriptionSelector)
        .text()
        .trim();

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
    const imagesSelector = ".x8c8t ._19N6A img";

    let images = [];
    $(imagesSelector).each((i, el) => {
        const imageUrl = $(el).attr("src");
        // Replace small image URL to large image URL
        const largeImageUrl = changeToLargeImageUrl(imageUrl);

        largeImageUrl && images.push(largeImageUrl);
    });

    return images;
}

/**
 * Get Vendor product type name
 *
 * @param {*} $ cheerio data
 */
function getProductTypeName($) {
    const typeNameSelector = "._3moNK a:nth-child(4)";

    let typeName = "";
    typeName = $(typeNameSelector)
        .text()
        .replace(/>/, "")
        .trim();

    return typeName;
}

/**
 * @param {*} url
 */
export default async url => {
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
        transform: body => cheerio.load(body),
    };
    // Get Vendor product page
    const $ = await request(options);

    // Get Vendor product Name, brand name
    const { name, brandName } = getProductName($);
    data.name = name;
    data.brandName = brandName;

    // Get Vendor product type name
    data.typeName = getProductTypeName($);

    // Get Vendor product MRP, price
    const { mrp, price } = getProductPrice($);
    data.mrp = mrp;
    data.price = price;

    // Get Vendor product image
    data.image = getProductImage($);

    // Get Vendor product description
    data.images = getProductSubImages($);

    // Get Vendor product description
    data.description = getProductDescription($);

    return data;
};
