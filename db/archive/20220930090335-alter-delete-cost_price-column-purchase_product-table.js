'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase_product table - Removing cost_price column");
      return queryInterface.describeTable("purchase_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["cost_price"]) {
          return queryInterface.removeColumn("purchase_product", "cost_price");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};

