"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");

    if (tableDefinition && tableDefinition["payment"]) {
      await queryInterface.removeColumn("description", "payment");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("payment");

    if (tableDefinition && !tableDefinition["payment"]) {
      await queryInterface.addColumn("description", "payment", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
