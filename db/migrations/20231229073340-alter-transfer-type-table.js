'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && !tableDefinition["allow_replenishment"]) {
      await queryInterface.addColumn("transfer_type", "allow_replenishment", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");
    if (tableDefinition && tableDefinition["allow_replenishment"]) {
      await queryInterface.removeColumn("transfer_type", "allow_replenishment");
    }
  },
};
