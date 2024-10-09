'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");
    if (tableDefinition && !tableDefinition["force_logout"]) {
      await queryInterface.addColumn("user_index", "force_logout", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");
    if (tableDefinition && tableDefinition["force_logout"]) {
      await queryInterface.removeColumn("user_index", "force_logout");
    }
  },
};
