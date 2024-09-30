'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering jobs_email_template table - Removing portal_id column");
      return queryInterface.describeTable("jobs_email_template").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["portal_id"]) {
          return queryInterface.removeColumn("jobs_email_template", "portal_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};