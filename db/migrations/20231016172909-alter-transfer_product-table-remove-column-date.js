"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering transfer_product table - Removing date column");
      return queryInterface.describeTable("transfer_product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["date"]) {
          return queryInterface.removeColumn("transfer_product", "date");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
