"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering invoice table - Removing delivery_status column");
      return queryInterface.describeTable("invoice").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["delivery_status"]) {
          return queryInterface.removeColumn("invoice", "delivery_status");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};