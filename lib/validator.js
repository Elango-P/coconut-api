const restify = require('restify');
let errors = require('restify-errors');

const validator = (module.exports = {
  /**
   * Validate Email
   *
   * @param email
   * @returns {boolean}
   */
  isEmail: (email) => {
    const emailRegex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!emailRegex.test(email)) {
      return false;
    }

    return true;
  },

  /**
   * Is Phone
   *
   * @param phone
   * @returns {boolean}
   */
  isPhone: (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
      return false;
    }

    return true;
  },

  /**
   * Is ZipCode
   *
   * @param zip
   * @returns {boolean}
   */
  isZipCode: (zip) => {
    const zipCodeRegEx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    if (!zipCodeRegEx.test(zip)) {
      return false;
    }

    return true;
  },

  /**
   * Is Integer
   *
   * @param int
   * @returns {boolean}
   */
  isInteger: (int) => {
    if (isNaN(int)) {
      return false;
    }

    return true;
  },

  /**
   * Is Base64
   *
   * @param string
   * @returns {boolean}
   */
  isBase64: (string) => {
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    return base64regex.test(string);
  },

  /**
   * Validation Error
   *
   * @param string
   * @param required
   * @returns {restify.errors.BadRequestError}
   */
  validationError: (string, required = true) => {
    if (required) {
      return new errors.BadRequestError(
        `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()} is required`
      );
    }

    return new errors.BadRequestError(`Invalid ${string.toLowerCase()}`);
  },

  /**
   * Validate Integer
   *
   * @param value
   * @param label
   * @param isRequired
   * @param callback
   * @returns {*}
   */
  validateInteger: (value, label, isRequired = true, callback) => {
    if (typeof isRequired === 'function') {
      callback = isRequired;
      isRequired = true;
    }

    if (isRequired && !value) {
      return callback(validator.validationError(label));
    }

    if (typeof value !== 'undefined' && !validator.isInteger(value)) {
      return callback(validator.validationError(label, false));
    }

    return callback();
  },

  /**
   * Validate Fields
   *
   * @param fields
   * @param callback
   * @returns {*}
   */
  validateFields: (fields, callback) => {
    if (fields.length === 0) {
      return callback();
    }

    fields.forEach((field) => {
      if (!field.validateIfDefined || (field.validateIfDefined && typeof field.value !== 'undefined')) {
        if (field.type === 'integer') {
          validator.validateInteger(field.value, field.label, !field.optional, (err) => {
            if (err) {
              return callback(err);
            }
          });
        } else if (!field.optional && !field.value) {
          return callback(validator.validationError(field.label));
        }
      }
    });

    return callback();
  },

  /**
   * Check Is strong password
   *
   * @param value
   * @returns {boolean}
   */
  isStrongPassword: (value) => {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!passwordRegex.test(value)) {
      return false;
    }

    return true;
  },

  isEmpty: (value) => {
    return value == undefined ? true :value === "true" ? true : false;
  },

  isNotEmpty: (value) => {
    return !validator.isEmpty(value);
  },

  isValidDraftFormat: (jsonString) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return (
        Array.isArray(parsedData.blocks) &&
        parsedData.blocks.length > 0 &&
        typeof parsedData.blocks[0] === 'object' &&
        typeof parsedData.blocks[0].key === 'string' &&
        typeof parsedData.blocks[0].text === 'string' &&
        typeof parsedData.blocks[0].type === 'string' &&
        typeof parsedData.blocks[0].depth === 'number' &&
        Array.isArray(parsedData.blocks[0].inlineStyleRanges) &&
        Array.isArray(parsedData.blocks[0].entityRanges) &&
        typeof parsedData.blocks[0].data === 'object' &&
        typeof parsedData.entityMap === 'object'
      );
    } catch (error) {
      return false;
    }
  },
   convertDraftFormatToText  :(jsonData)=>{
    const value =  jsonData.blocks.map(block => block.text);
    return value;
 },

  convertTextToDraftFormat: (text) => {
    if (text) {
      const jsonObject = {
        blocks: [
          {
            key: '5l88h',
            text: text,
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      };

      const jsonString = JSON.stringify(jsonObject);
      return jsonString;
    }
  },
  isPdfFormat: (url) => url.toLowerCase().endsWith('.pdf'),
  isImageFormat: (url) =>
    url.toLowerCase().endsWith('.jpg') ||
    url.toLowerCase().endsWith('.jpeg') ||
    url.toLowerCase().endsWith('.png') ||
    url.toLowerCase().endsWith('.gif'),


    isKeyAvailable:(obj,key)=>{
     let isKey = Object.keys(obj).includes(key);
     return isKey
    },
});
