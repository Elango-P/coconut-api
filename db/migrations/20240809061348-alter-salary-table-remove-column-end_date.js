"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering salary table - Removing end_date column");
      return queryInterface.describeTable("salary").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["end_date"]) {
          return queryInterface.removeColumn("salary", "end_date");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};