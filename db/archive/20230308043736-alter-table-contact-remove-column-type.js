"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering contact table - Removing type column");
      return queryInterface.describeTable("contact").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["type"]) {
          return queryInterface.removeColumn("contact", "type");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};