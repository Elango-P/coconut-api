'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_employment");

    if (tableDefinition && !tableDefinition["leave_balance_updated_at"]) {
      await queryInterface.addColumn("user_employment", "leave_balance_updated_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_employment");

    if (tableDefinition && tableDefinition["leave_balance_updated_at"]) {
      await queryInterface.removeColumn("user_employment", "leave_balance_updated_at");
    }
  },
};
