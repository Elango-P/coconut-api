'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && !tableDefinition["group"]) {
      await queryInterface.addColumn("transfer_type", "group", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && tableDefinition["group"]) {
      await queryInterface.removeColumn("transfer_type", "group");
    }
  },
};
