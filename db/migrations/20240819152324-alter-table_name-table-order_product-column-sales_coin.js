"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering order_product table - Renaming column sales_coin to reward");
      return queryInterface.describeTable("order_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["sales_coin"]) {
          return queryInterface.renameColumn("order_product", "sales_coin", "reward");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
