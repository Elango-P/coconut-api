"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering salary table - Removing start_date column");
      return queryInterface.describeTable("salary").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["start_date"]) {
          return queryInterface.removeColumn("salary", "start_date");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};