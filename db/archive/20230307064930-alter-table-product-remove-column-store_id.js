"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product table - Removing store_id column");
      return queryInterface.describeTable("product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["store_id"]) {
          return queryInterface.removeColumn("product", "store_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
