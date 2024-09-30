'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding group column");
      
      const tableDefinition = await queryInterface.describeTable("status");

      if (tableDefinition && !tableDefinition["group"]) {
          await queryInterface.addColumn("status", "group", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("status");

      if (tableDefinition && tableDefinition["group"]) {
          await queryInterface.removeColumn("status", "group");
      }
  },
};
