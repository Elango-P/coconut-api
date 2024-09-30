"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column billing name to purchase name");
      return queryInterface.describeTable("purchase").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_bill_number"]) {
          return queryInterface.renameColumn("purchase", "vendor_bill_number", "vendor_purchase_number");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
