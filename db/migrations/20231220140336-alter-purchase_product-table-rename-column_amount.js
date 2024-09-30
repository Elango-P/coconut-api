"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase_product table - Renaming column amount to net_amount");
      return queryInterface.describeTable("purchase_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["amount"]) {
          return queryInterface.renameColumn("purchase_product", "amount", "net_amount");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
