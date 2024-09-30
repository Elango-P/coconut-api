"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product_index table - Renaming column sales_coin to reward");
      return queryInterface.describeTable("product_index").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["sales_coin"]) {
          return queryInterface.renameColumn("product_index", "sales_coin", "reward");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
