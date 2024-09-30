"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering purchase media table - Renaming column bill_id to purchase_id");
      return queryInterface.describeTable("purchase_media").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bill_id"]) {
          return queryInterface.renameColumn("purchase_media", "bill_id", "purchase_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};