"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product table - Removing price column");
      return queryInterface.describeTable("product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["price"]) {
          return queryInterface.removeColumn("product", "price");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
