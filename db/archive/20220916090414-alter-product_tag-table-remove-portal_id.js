'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering product_tag table - Removing portal_id column");
      return queryInterface.describeTable("product_tag").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("product_tag", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
