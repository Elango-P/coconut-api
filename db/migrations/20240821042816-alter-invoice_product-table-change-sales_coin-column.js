"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering invoice_product table - Renaming column sales_coin to reward");
      return queryInterface.describeTable("invoice_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["sales_coin"]) {
          return queryInterface.renameColumn("invoice_product", "sales_coin", "reward");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
