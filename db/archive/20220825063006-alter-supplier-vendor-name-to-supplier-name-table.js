"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier table - Renaming column vendor_name to supplier_name");
      return queryInterface.describeTable("supplier").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_name"]) {
          return queryInterface.renameColumn("supplier", "vendor_name", "supplier_name");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
