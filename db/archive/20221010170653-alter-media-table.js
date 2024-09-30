"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition && !tableDefinition["status"]) {
      await queryInterface.addColumn("media", "status", {
        type: Sequelize.INTEGER,
        defaultValue : 1,
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["public"]) {
      await queryInterface.removeColumn("media", "public");
    }

    if (tableDefinition && !tableDefinition["visibility"]) {
      await queryInterface.addColumn("media", "visibility", {
        type: Sequelize.INTEGER,
        defaultValue : 2,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition && tableDefinition["status"]) {
      await queryInterface.removeColumn("media", "status");
    }

    if (tableDefinition && !tableDefinition["public"]) {
      await queryInterface.addColumn("media", "public", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });
    }

    if (tableDefinition && tableDefinition["visibility"]) {
      await queryInterface.removeColumn("media", "visibility");
    }
  },
};
