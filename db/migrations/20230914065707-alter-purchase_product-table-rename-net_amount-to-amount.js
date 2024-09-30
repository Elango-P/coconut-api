"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase_product table - Renaming column net_amount to amount");
      return queryInterface.describeTable("purchase_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["net_amount"]) {
          return queryInterface.renameColumn("purchase_product", "net_amount", "amount");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
