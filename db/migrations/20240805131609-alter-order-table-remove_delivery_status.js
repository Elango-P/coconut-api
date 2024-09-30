
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering order table - Removing delivery_status column");
      return queryInterface.describeTable("order").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["delivery_status"]) {
          return queryInterface.removeColumn("order", "delivery_status");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
};