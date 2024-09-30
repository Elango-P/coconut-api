'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("address");
    if (tableDefinition && !tableDefinition["latitude"]) {
      await queryInterface.addColumn("address", "latitude", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("address");
    if (tableDefinition && tableDefinition["latitude"]) {
      await queryInterface.removeColumn("address", "latitude");
    }
  },
};