'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");
    if (tableDefinition && !tableDefinition["bank_reference_number"]) {
      await queryInterface.addColumn("account_entry", "bank_reference_number", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");
    if (tableDefinition && tableDefinition["bank_reference_number"]) {
      await queryInterface.removeColumn("account_entry", "bank_reference_number");
    }
  },
};

