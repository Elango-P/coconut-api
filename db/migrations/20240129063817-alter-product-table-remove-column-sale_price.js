"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove sale_price
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["sale_price"]) {
        return queryInterface.removeColumn("product", "sale_price");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove barcode
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["barcode"]) {
        return queryInterface.removeColumn("product", "barcode");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove weight_unit_id
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["weight_unit_id"]) {
        return queryInterface.removeColumn("product", "weight_unit_id");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove cost
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["cost"]) {
        return queryInterface.removeColumn("product", "cost");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove mrp
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["mrp"]) {
        return queryInterface.removeColumn("product", "mrp");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove margin_percentage
    await queryInterface.describeTable("product").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["margin_percentage"]) {
        return queryInterface.removeColumn("product", "margin_percentage");
      } else {
        return Promise.resolve(true);
      }
    });
  },
};
