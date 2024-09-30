'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");
    if (tableDefinition && !tableDefinition["password"]) {
      await queryInterface.addColumn("customer", "password", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");
    if (tableDefinition && tableDefinition["password"]) {
      await queryInterface.removeColumn("customer", "password");
    }
  },
};

