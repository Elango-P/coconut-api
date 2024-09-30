"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering comment table - Renaming column ticket_id to object_id");
      return queryInterface.describeTable("comment").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["ticket_id"]) {
          return queryInterface.renameColumn("comment", "ticket_id", "object_id");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
