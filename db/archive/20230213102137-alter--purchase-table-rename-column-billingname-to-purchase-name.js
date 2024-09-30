"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column billing name to purchase name");
      return queryInterface.describeTable("purchase").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["billing_name"]) {
          return queryInterface.renameColumn("purchase", "billing_name", "purchase_name");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
