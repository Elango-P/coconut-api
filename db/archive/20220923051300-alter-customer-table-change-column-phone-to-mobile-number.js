"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering customer table - Renaming column phone to mobile_number");
      return queryInterface.describeTable("customer").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["phone"]) {
          return queryInterface.renameColumn("customer", "phone", "mobile_number1");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
