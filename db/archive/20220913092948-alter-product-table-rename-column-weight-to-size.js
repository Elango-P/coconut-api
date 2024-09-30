"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product table - Renaming column weight to size");
      return queryInterface.describeTable("product").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["weight"]) {
          return queryInterface.renameColumn("product", "weight", "size");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
