'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_employment");

    if (tableDefinition && !tableDefinition["leave_balance"]) {
      await queryInterface.addColumn("user_employment", "leave_balance", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_employment");

    if (tableDefinition && tableDefinition["leave_balance"]) {
      await queryInterface.removeColumn("user_employment", "leave_balance");
    }
  },
};
