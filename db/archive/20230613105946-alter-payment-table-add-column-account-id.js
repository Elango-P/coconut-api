
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && !tableDefinition["account_id"]) {
      await queryInterface.addColumn("payment", "account_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");
    if (tableDefinition && tableDefinition["account_id"]) {
      await queryInterface.removeColumn("payment", "account_id");
    }
  },
};
