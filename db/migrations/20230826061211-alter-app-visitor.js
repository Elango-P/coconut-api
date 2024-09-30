"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");

    if (tableDefinition && !tableDefinition["type"]) {
      await queryInterface.addColumn("visitor", "type", {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");

    if (tableDefinition && tableDefinition["type"]) {
      await queryInterface.removeColumn("visitor", "type");
    }

  },
};