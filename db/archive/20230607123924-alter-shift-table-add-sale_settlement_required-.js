'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");
    if (tableDefinition && !tableDefinition["sale_settlement_required"]) {
      await queryInterface.addColumn("shift", "sale_settlement_required", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");
    if (tableDefinition && tableDefinition["sale_settlement_required"]) {
      await queryInterface.removeColumn("shift", "sale_settlement_required");
    }
  },
};
