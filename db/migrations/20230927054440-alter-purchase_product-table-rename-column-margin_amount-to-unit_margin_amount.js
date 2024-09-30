"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase_product table - Renaming column margin_amount to unit_margin_amount");
      return queryInterface.describeTable("purchase_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["margin_amount"]) {
          return queryInterface.renameColumn("purchase_product", "margin_amount", "unit_margin_amount");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
