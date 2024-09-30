"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.removeColumn("media", "description");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("media");

    if (tableDefinition && !tableDefinition["description"]) {
      await queryInterface.addColumn("media", "description", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
