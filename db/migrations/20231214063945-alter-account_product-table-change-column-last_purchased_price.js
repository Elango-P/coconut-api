"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account_product table - Renaming column last_purchased_price to cost_price");
      return queryInterface.describeTable("account_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["last_purchased_price"]) {
          return queryInterface.renameColumn("account_product", "last_purchased_price", "cost_price");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
