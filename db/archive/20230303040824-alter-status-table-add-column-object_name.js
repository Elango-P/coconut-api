"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && !tableDefinition["object_name"]) {
      await queryInterface.addColumn("status", "object_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("status");

    if (tableDefinition && tableDefinition["object_name"]) {
      await queryInterface.removeColumn("status", "object_name");
    }
  },
};
