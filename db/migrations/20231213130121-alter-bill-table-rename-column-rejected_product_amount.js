"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering bill table - Renaming column returned_items_amount to rejected_product_amount");
      return queryInterface.describeTable("bill").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["returned_items_amount"]) {
          return queryInterface.renameColumn("bill", "returned_items_amount", "rejected_product_amount");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
