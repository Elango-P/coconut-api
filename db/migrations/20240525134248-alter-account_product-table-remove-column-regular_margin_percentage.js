"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove primary_location_id
    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["total_margin_percentage"]) {
        return queryInterface.removeColumn("account_product", "total_margin_percentage");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove primary_shift_id
    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["scheme_discount_percentage"]) {
        return queryInterface.removeColumn("account_product", "scheme_discount_percentage");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["cash_discount_percentage"]) {
        return queryInterface.removeColumn("account_product", "cash_discount_percentage");
      } else {
        return Promise.resolve(true);
      }
    });
    
  },
};
