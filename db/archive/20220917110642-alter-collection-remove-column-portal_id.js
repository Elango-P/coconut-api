'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering collection table - Removing portal_id column");
      return queryInterface.describeTable("collection").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("collection", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};