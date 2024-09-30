"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column billing name to purchase name");
      return queryInterface.describeTable("purchase").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bill_id"]) {
          return queryInterface.renameColumn("purchase", "bill_id", "purchase_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};

