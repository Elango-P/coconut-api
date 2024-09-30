"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    console.log("Alter Table: Adding media_url to user table");

    if (tableDefinition && !tableDefinition["media_url"]) {
      await queryInterface.addColumn("user", "media_url", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["media_url"]) {
      await queryInterface.removeColumn("user", "media_url");
    }
  }
};
