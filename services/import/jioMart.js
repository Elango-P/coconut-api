/**
 * Module dependencies
 */
const request = require("request-promise");
const cheerio = require("cheerio");
const util = require("../../lib/Url");

/**
 * Get vendor product MRP
 *
 * @param {*} $ cheerio data
 */
function getProductPrice($) {
    const mrpSelector = "#price_section .price-box .price strike";
    const priceSelector = "#price_section .price-box .final-price span";

    let mrp = "";
    mrp = $(mrpSelector)
        .text()
        .replace(/₹/, "")
        .trim();

    let price = "";
    price = $(priceSelector)
        .text()
        .replace(/₹/, "")
        .trim();

    return { mrp, price };
}

/**
 * Get Vendor product Name
 *
 * @param {*} $ cheerio data
 */
function getProductName($) {
    const brandNameSelector = ".brand_name";
    const productNameSelector = ".title-section h1";

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
    const productImageSelector = ".swiper-slide .largeimage";

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
    const descriptionSelector = "#fea_details #first_desc p";

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

    return url.replace(/\/150x150\//, "/420x420/");
}

/**
 * Get Vendor product sub images
 *
 * @param {*} $ cheerio data
 */
function getProductSubImages($) {
    const imagesSelector = ".thumbs_img .swiper-wrapper .swiper-slide img";

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
module.exports =  async url => {
    // Validate URL
    if (!url) {
        throw { message: "Vendor product page URL is required" };
    }

    const data = {};

    //Set Vendor base URL
    const baseUrl = util.getBaseUrl(url);
    if (baseUrl) {
        data.vendorBaseUrl = baseUrl;
    }

    const options = {
        url,
        method: "GET",
        headers: {
            ["User-Agent"]:
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
            Accept: "*/*",
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
    // data.typeName = getProductTypeName($);

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
