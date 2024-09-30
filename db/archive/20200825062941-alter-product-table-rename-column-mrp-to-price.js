"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product table - Renaming column mrp to price");
      return queryInterface.describeTable("product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["mrp"]) {
          return queryInterface.renameColumn("product", "mrp", "price");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
