"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return queryInterface.describeTable("project_ticket_type").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["default_assignee"]) {
          return queryInterface.removeColumn("project_ticket_type", "default_assignee");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};