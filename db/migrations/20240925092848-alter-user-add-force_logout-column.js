'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    if (tableDefinition && !tableDefinition["force_logout"]) {
      await queryInterface.addColumn("user", "force_logout", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");
    if (tableDefinition && tableDefinition["force_logout"]) {
      await queryInterface.removeColumn("user", "force_logout");
    }
  },
};
