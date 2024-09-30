"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier_product table - Renaming column url to supplier_url");
      return queryInterface.describeTable("supplier_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["url"]) {
          return queryInterface.renameColumn("supplier_product", "url", "supplier_url");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};