"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column bill number to purchase_number");
      return queryInterface.describeTable("purchase").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bill_number"]) {
          return queryInterface.renameColumn("purchase", "bill_number", "purchase_number");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
