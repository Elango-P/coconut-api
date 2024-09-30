'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering drive table - Removing portal_id column");
      return queryInterface.describeTable("drive").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("drive", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};