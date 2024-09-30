"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("message");
    if (tableDefinition && !tableDefinition["channel_id"]) {
      await queryInterface.addColumn("message", "channel_id", {
        type: Sequelize.INTEGER,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("message");
    if (tableDefinition && tableDefinition["message"]) {
      await queryInterface.removeColumn("message", "channel_id");
    }
  },
};