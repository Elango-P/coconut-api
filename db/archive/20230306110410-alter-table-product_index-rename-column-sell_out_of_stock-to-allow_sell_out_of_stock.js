"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.describeTable("product_index").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["sell_out_of_stock"]) {
          return queryInterface.renameColumn("product_index", "sell_out_of_stock", "allow_sell_out_of_stock");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};