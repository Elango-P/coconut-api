"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("visitor");

    if (tableDefinition && !tableDefinition["position"]) {
      await queryInterface.addColumn("visitor", "position", {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("position");

    if (tableDefinition && tableDefinition["position"]) {
      await queryInterface.removeColumn("visitor", "position");
    }

  },
};