"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove margin_amount
    await queryInterface.describeTable("product_price").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["margin_amount"]) {
        return queryInterface.removeColumn("product_price", "margin_amount");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove margin_percentage
    await queryInterface.describeTable("product_price").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["margin_percentage"]) {
        return queryInterface.removeColumn("product_price", "margin_percentage");
      } else {
        return Promise.resolve(true);
      }
    });

  },
};
