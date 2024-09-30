"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account_entry table - Renaming column bank to payment_account");
      return queryInterface.describeTable("account_entry").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bank"]) {
          return queryInterface.renameColumn("account_entry", "bank", "payment_account");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
