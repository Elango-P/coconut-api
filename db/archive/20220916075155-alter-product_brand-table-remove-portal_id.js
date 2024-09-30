'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product_brand table - Removing portal_id column");
      return queryInterface.describeTable("product_brand").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("product_brand", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
