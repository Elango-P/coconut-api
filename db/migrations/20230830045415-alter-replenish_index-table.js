'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("replenish_index");
    if (tableDefinition && !tableDefinition["owner_id"]) {
      await queryInterface.addColumn("replenish_index", "owner_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("replenish_index");
    if (tableDefinition && tableDefinition["owner_id"]) {
      await queryInterface.removeColumn("replenish_index", "owner_id");
    }
  },
};