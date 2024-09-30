
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering candidate_profile table - Removing portal_id column");
      return queryInterface.describeTable("candidate_profile").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("candidate_profile", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};