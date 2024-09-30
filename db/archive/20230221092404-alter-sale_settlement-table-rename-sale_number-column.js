"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering sale_settlement table - Renaming column bill number to sale_settlement_number");
      return queryInterface.describeTable("sale_settlement").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["sale_number"]) {
          return queryInterface.renameColumn("sale_settlement", "sale_number", "sale_settlement_number");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
