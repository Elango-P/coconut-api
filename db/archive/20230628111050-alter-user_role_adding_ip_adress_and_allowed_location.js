'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_role");
    if (tableDefinition && !tableDefinition["allowed_ip_address"]) {
      await queryInterface.addColumn("user_role", "allowed_ip_address", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["allowed_locations"]) {
      await queryInterface.addColumn("user_role", "allowed_locations", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_role");
    if (tableDefinition && tableDefinition["allowed_ip_address"]) {
      await queryInterface.removeColumn("user_role", "allowed_ip_address");
    }
    if (tableDefinition && tableDefinition["allowed_locations"]) {
      await queryInterface.removeColumn("user_role", "allowed_locations");
    }
  },
};