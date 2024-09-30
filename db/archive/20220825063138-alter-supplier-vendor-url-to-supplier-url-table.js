"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering supplier table - Renaming column vendor_url to supplier_url");
      return queryInterface.describeTable("supplier").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["vendor_url"]) {
          return queryInterface.renameColumn("supplier", "vendor_url", "supplier_url");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
