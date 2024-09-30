"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier table - Renaming column vendor_id to supplier_id");
      return queryInterface.describeTable("supplier").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_Id"]) {
          return queryInterface.renameColumn("supplier", "vendor_Id", "supplier_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
