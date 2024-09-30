const crypto = require("crypto");

const encryptionKey = "FmqmfrEnPFYW0Rahhf7aGdqKbVJYiFqd";
const ivString = "bbffac87c9e524af";

/**
 * Encrypt text
 * @param {*} text
 */
 const encrypt = async text => {

    /* ----- To Generate new iv string -----*/
    // const IV_LENGTH = 8;
    // const iv = crypto.randomBytes(IV_LENGTH);
    // const ivstring = iv.toString("hex");
    // console.log("ivstring----------------->", ivstring);

    /* Update the ivString in line 4 with ivstring from the console */

    let cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, ivString);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

/**
 * Decrypt text
 * @param {*} text
 */
 const decrypt = async text => {
    let cipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(encryptionKey),
        ivString
    );
    let decrypted = cipher.update(text, "hex", "utf8");
    decrypted += cipher.final("utf8");
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt,
};
