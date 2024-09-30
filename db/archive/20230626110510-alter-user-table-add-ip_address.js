'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    if (tableDefinition && !tableDefinition["ip_address"]) {
      await queryInterface.addColumn("user", "ip_address", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    if (tableDefinition && tableDefinition["ip_address"]) {
      await queryInterface.removeColumn("user", "ip_address");
    }
  },
};