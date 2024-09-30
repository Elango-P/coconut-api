
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("address");
    if (tableDefinition && !tableDefinition["longitude"]) {
      await queryInterface.addColumn("address", "longitude", {
          type: Sequelize.STRING,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("address");
    if (tableDefinition && tableDefinition["longitude"]) {
      await queryInterface.removeColumn("address", "longitude");
    }
  },
};
