"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering sale_settlement table - Removing product_count column");
      return queryInterface.describeTable("sale_settlement").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["product_count"]) {
          return queryInterface.removeColumn("sale_settlement", "product_count");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
