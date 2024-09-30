"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering user table - Removing user_type column");
      return queryInterface.describeTable("user").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["user_type"]) {
          return queryInterface.removeColumn("user", "user_type");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};
