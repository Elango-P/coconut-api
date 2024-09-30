"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering address table - Renaming column mobile_number to phone_number");
      return queryInterface.describeTable("address").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["mobile_number"]) {
          return queryInterface.renameColumn("address", "mobile_number", "phone_number");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
