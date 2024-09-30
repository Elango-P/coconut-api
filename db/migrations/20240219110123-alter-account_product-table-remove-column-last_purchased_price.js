"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove last_purchased_date
    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["last_purchased_date"]) {
        return queryInterface.removeColumn("account_product", "last_purchased_date");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove last_purchased_price
    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["last_purchased_price"]) {
        return queryInterface.removeColumn("account_product", "last_purchased_price");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove last_purchased_margin_percentage
    await queryInterface.describeTable("account_product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["last_purchased_margin_percentage"]) {
        return queryInterface.removeColumn("account_product", "last_purchased_margin_percentage");
      } else {
        return Promise.resolve(true);
      }
    });

 
  },
};
