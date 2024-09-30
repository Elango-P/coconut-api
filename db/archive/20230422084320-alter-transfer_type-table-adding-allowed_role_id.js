"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");

    if (tableDefinition && !tableDefinition["allowed_role_id"]) {
      await queryInterface.addColumn("transfer_type", "allowed_role_id", {
        type: Sequelize.STRING,
        allowNull: true 
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("transfer_type");

    if (tableDefinition && tableDefinition["allowed_role_id"]) {
      await queryInterface.removeColumn("transfer_type", "allowed_role_id");
    }

  },
};
