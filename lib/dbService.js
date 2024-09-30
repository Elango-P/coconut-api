const {  sequelize } = require("../db").models;

/**
 * Update Find And Replace The Field
 *
 * @param {*} id
 * @param {*} table
 * @param {*} fieldName
 * @param {*} findValue
 * @param {*} replaceValue
 * @param {*} callback
 */
const updateUsingFindAndReplace = (
    id,
    table,
    fieldName,
    findValue,
    replaceValue,
    callback
) => {
    if (!findValue) {
        return callback();
    }

    if (findValue) {
        return sequelize
            .query(
                `UPDATE ${table} SET ${fieldName} = regexp_replace(${fieldName}, '${findValue}', '${
                    replaceValue ? replaceValue : ""
                }', 'i') WHERE id = ${id}`
            )
            .then(() => callback());
    }

    return callback();
};

module.exports =  {
    updateUsingFindAndReplace,
};
