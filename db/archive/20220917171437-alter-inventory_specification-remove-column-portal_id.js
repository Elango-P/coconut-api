'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering inventory_specification table - Removing portal_id column");
      return queryInterface.describeTable("inventory_specification").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("inventory_specification", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};