const { isUndefined } = require("../utils/validator");
const bcrypt = require("bcryptjs");
const config = require("./config");

const { passwordSaltKey } = require("./config");

// Services
const locationService = require("../services/LocationService");

const String = require("./string");

const utils = (module.exports = {
    /**
     * Get Last Page
     *
     * @param count
     * @param pageSize
     * @returns {Number}
     */
    getLastPage: (count, pageSize) => {
        let lastPage = parseInt(count / pageSize, 10);
        lastPage += count % pageSize === 0 ? 0 : 1;

        return lastPage;
    },
    /**
     * Get Extension By Type
     *
     * @param fileType
     * @returns {*}
     */
    getExtensionByType: (fileType) => {
        switch (fileType) {
            case "image/png":
                return "png";
            case "image/jpeg":
            case "image/jpg":
                return "jpg";
            case "image/gif":
                return "gif";
            case "image/bmp":
                return "bmp";
            default:
                return "";
        }
    },
    getInteger: (int) => {
        try {
            if (!int) {
                return null;
            }
            let value;
            if (isNaN(parseInt(int, 10))) {
                value = null;
            } else value = parseInt(int, 10);
            return value;
        } catch (error) {
            console.log(error);
        }
    },
   

    //Get the file extension
    getFileExtension: (filename) => {
        try {
            // get file extension
            const extension = filename.split(".").pop();
            return extension;
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * Raw URL Decode
     *
     * @param str
     * @returns {*}
     */
    rawURLDecode: str => {
        if (!str) {
            return null;
        }

        try {
            return decodeURIComponent(
                str.replace(/%(?![\da-f]{2})/gi, () => "%25")
            );
        } catch (e) {
            return null;
        }
    },

    /**
     * Remove Undefined Keys
     *
     * @param object
     */
    removeUndefinedKeys: object => {
        const returnObject = {};

        Object.keys(object).forEach(key => {
            if (!isUndefined(object[key])) {
                returnObject[key] = object[key];
            }
        });

        return returnObject;
    },

    /**
     * Get Random String
     *
     * @param str
     */
    getRandomString: str => str || Math.floor(Date.now()).toString(),

    /**
     * Generate Random String
     */
    randomString: (length = 32) => {
        const possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let text = "";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        return text;
    },

    /**
     *  Compare new data with old data
     *
     * @param data
     * @param encdata
     * @returns {boolean}
     */
    hasher: (data, encdata) => {
        // if encrypted data is passed, check it against input (data)
        if (encdata) {
            return !!bcrypt.compareSync(data, encdata.substr(0, 60));
        }
    },

    /**
     * Get Hash Password
     */
    getHashPassword: (password, callback) => {
        if (!password) {
            return callback();
        }

        // Generate the salt key
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                return callback(err);
            }

            let saltKey = "";
            if (passwordSaltKey) {
                saltKey = salt.replace(passwordSaltKey, "");
            }

            // Generate the hash password using password and salt
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return callback;
                }

                return callback(null, password, hash + saltKey);
            });
        });
    },

    /**
     * Generate Random Password
     */
    randomPassword: callback => {
        const password = String.randomString(8);
        bcrypt.genSalt(8, (err, salt) => {
            if (err) {
                return callback(err);
            }

            const saltKey = salt.replace("$2b$08$", "");
            bcrypt.hash(password, salt, "", (err, hash) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, password, hash + saltKey);
            });
        });
    },

    /**
     * Degree to Radiant
     *
     * @param degree
     * @returns {number}
     */
    degToRad: degree => {
        const pi = Math.PI;

        return Math.abs(Math.cos(degree * (pi / 180)) * 69);
    },

    /**
     * Convert object numeric to string
     *
     * @param object
     * @returns {{}}
     */
    convertObjectNumericToString: object => {
        const convertedObject = {};
        Object.keys(object).forEach(param => {
            convertedObject[param] =
                object[param] !== null && object[param] !== undefined
                    ? object[param].toString()
                    : object[param];
        });

        return convertedObject;
    },

    /**
     * Convert object value to string
     *
     * @param object
     * @returns {{}}
     */
    convertObjectValueToString: object => {
        const convertedObject = {};
        Object.keys(object).forEach(param => {
            convertedObject[param] =
                object[param] !== null && object[param] !== undefined
                    ? object[param].toString().trim()
                    : "";
        });

        return convertedObject;
    },

    /***
     * Get Page Details
     *
     * @param count
     * @param currentPage
     * @param pageSize
     * @param currentPageLength
     * @returns {{count: *, currentPage: *, lastPage: Number, pageStart: number, pageEnd: *}}
     */
    getPageDetails: (count, currentPage, pageSize, currentPageLength) => {
        if (typeof count === "object") {
            count = count.length;
        }
        const pageStart = count > 0 ? pageSize * (currentPage - 1) + 1 : 0;
        const pageEnd = count > 0 ? pageStart - 1 + currentPageLength : 0;

        let lastPage = parseInt(count / pageSize, 10);
        lastPage += count % pageSize === 0 ? 0 : 1;

        lastPage = lastPage > 0 ? lastPage : 1;

        return { count, currentPage, lastPage, pageStart, pageEnd };
    },

    /**
     * Get Extension By Type
     *
     * @param fileType
     * @returns {*}
     */
    getExtensionByType: fileType => {
        switch (fileType) {
            case "image/png":
                return "png";
            case "image/jpeg":
            case "image/jpg":
                return "jpg";
            case "image/gif":
                return "gif";
            case "image/bmp":
                return "bmp";
            default:
                return "";
        }
    },

    /**
     * Get Concat Name
     *
     * @param firstName
     * @param lastName
     * @returns {*}
     */
    concatName: (firstName, lastName) => {
        let name = [];

        if (firstName) {
            name.push(firstName);
        }

        if (lastName) {
            name.push(lastName);
        }

        if (name) {
            return name.join(" ");
        }

        return "";
    },

    /**
     * Get Profile Initials
     *
     * @param firstName
     * @param lastName
     * @returns {string}
     */
    getInitials: (firstName, lastName) => {
        const initial = [];

        if (firstName) {
            initial.push(firstName[0]);
        }

        if (lastName) {
            initial.push(lastName[0]);
        }

        if (initial.length === 1 && firstName) {
            initial.push(firstName[1]);
        }

        return initial.join(" ");
    },

    /**
     * Is Base64
     *
     * @param string
     * @returns {boolean}
     */
    isBase64: string => {
        const base64RegEx = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!\$&',\(\)\*\+,;=\-\._~:@\/\?%\s]*\s*$/i;
        return base64RegEx.test(string);
    },

    /**
     * Get product image URL
     *
     * @param productId
     * @param mediaName
     */
    getProductImageUrl: (productId, mediaName) => {
        return `${config.baseUrl}/v1/product/image/${productId}/${mediaName}`;
    },

    /**
     * Remove query string from URL
     *
     * @param url
     */
    removeQueryStringFromUrl: url => {
        return url.replace(/([?]+).*/, "");
    },

    /**
     * Get base URL from URL
     *
     * @param url
     */
    getBaseUrl: url => {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    },

    /**
     * Get S3 url
     * @param mediaPath
     * @returns {string}
     */
    getS3ObjectUrl: mediaPath => {
        return `https://${config.aws.bucketName}.s3.amazonaws.com/${mediaPath}`;
    },

    /**
     * Get Shopify Admin Url
     *
     * @param storeId
     * @param url
     * @returns {string}
     */
    shopifyAdminAPI: async (storeId, url) => {
        const location = await locationService.getLocationDetails(storeId);
        return `https://${location.shopifyApiKey}:${config.shopifyPassword}@${location.shopifyStoreName}/admin/api/${location.shopifyAdminApiVersion}/${url}`;
    },

    /**
     * Convert To Shopify Product Data
     * @param data
     * @returns {array}
     */
    convertToShopifyProductData: data => {
        const {
            title,
            handle,
            body_html,
            product_type,
            vendor,
            tags,
            price,
            sale_price,
            weight,
            weight_unit,
            quantity,
            sku,
            inventory_policy,
            images,
            taxable,
            published,
        } = data;

        const shopifyProductData = {
            product: {
                title,
                handle,
                body_html: "",
                product_type,
                vendor,
                tags,
                published,
                variants: [
                    {
                        barcode: null,
                        compare_at_price: sale_price < price ? price : null,
                        fulfillment_service: "manual",
                        grams: null,
                        weight: weight || "0",
                        weight_unit: weight_unit || "",
                        inventory_quantity: quantity || null,
                        price: sale_price,
                        sku: sku || null,
                        taxable,
                        title: null,
                        inventory_policy: inventory_policy || null,
                    },
                ],
                images: images,
            },
        };

        return shopifyProductData;
    },

    /**
     * Get brand image URL
     *
     * @param brandId
     * @param mediaName
     */
    getBrandImageUrl: (brandId, mediaName) => {
        return `${config.baseUrl}/v1/product/brand/image/${brandId}/${mediaName}`;
    },

    /**
     * Raw URL Decode
     * 
     * @param str
     * @returns {*}
     */
    RawURLDecode: (str) => {
        if (!str) {
            return null;
        }

        try {
            return decodeURIComponent(str.replace(/%(?![\da-f]{2})/gi, () => "%25"));
        } catch (e) {
            return null;
        }
    },

    RawURLEncode: (str) => {
        if (!str) {
            return null;
        }

        try {
            return encodeURIComponent(str)
                .replace(/!/g, "%21")
                .replace(/'/g, "%27")
                .replace(/\(/g, "%28")
                .replace(/\)/g, "%29")
                .replace(/\*/g, "%2A");
        } catch (e) {
            return null;
        }
    },
});
