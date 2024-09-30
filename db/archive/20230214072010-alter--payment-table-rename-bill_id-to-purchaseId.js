"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column bill_id to payment_id");
      return queryInterface.describeTable("payment").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bill_id"]) {
          return queryInterface.renameColumn("payment", "bill_id", "purchase_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
