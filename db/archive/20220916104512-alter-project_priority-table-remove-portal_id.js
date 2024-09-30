'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering project_priority table - Removing portal_id column");
      return queryInterface.describeTable("project_priority").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("project_priority", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
