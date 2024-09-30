'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["manufacture_name"]) {
      await queryInterface.removeColumn("product", "manufacture_name");
    }
    if (tableDefinition && tableDefinition["manufacture_id"]) {
      await queryInterface.removeColumn("product", "manufacture_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && !tableDefinition["manufacture_name"]) {
      await queryInterface.addColumn("product", "manufacture_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["manufacture_id"]) {
      await queryInterface.addColumn("product", "manufacture_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};

