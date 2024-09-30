'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("company");
    if (tableDefinition && !tableDefinition["gst_number"]) {
      await queryInterface.addColumn("company", "gst_number", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("company");
    if (tableDefinition && tableDefinition["gst_number"]) {
      await queryInterface.removeColumn("company", "gst_number");
    }
  },
};