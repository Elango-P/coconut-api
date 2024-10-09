"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering order_type table - Removing group column");

      const tableDefinition = await queryInterface.describeTable("order_type");

      if (tableDefinition && tableDefinition["group"]) {
        console.log("group column exists, removing it...");
        await queryInterface.removeColumn("order_type", "group");
        console.log("group column removed successfully.");
      } else {
        console.log("group column does not exist, no action taken.");
      }
    } catch (err) {
      console.error("Error altering order_type table:", err);
      throw err; // Optional: Re-throw the error to propagate it
    }
  },
};
