"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    console.log("Alter Table: Adding media_id to user table");

    if (tableDefinition && !tableDefinition["media_id"]) {
      await queryInterface.addColumn("user", "media_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["media_id"]) {
      await queryInterface.removeColumn("user", "media_id");
    }
  }
};
