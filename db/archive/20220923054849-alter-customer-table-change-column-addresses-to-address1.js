"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering customer table - Renaming column addresses to address1");
      return queryInterface.describeTable("customer").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["addresses"]) {
          return queryInterface.renameColumn("customer", "addresses", "address1");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};