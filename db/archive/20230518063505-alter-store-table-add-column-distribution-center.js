'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding distribution center");
      
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && !tableDefinition["distribution_center"]) {
          await queryInterface.addColumn("store", "distribution_center", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && tableDefinition["distribution_center"]) {
          await queryInterface.removeColumn("store", "distribution_center");
      }
  },
};