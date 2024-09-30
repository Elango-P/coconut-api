'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding status column");
      
      const tableDefinition = await queryInterface.describeTable("product_media");

      if (tableDefinition && !tableDefinition["status"]) {
          await queryInterface.addColumn("product_media", "status", {
              type: Sequelize.TEXT,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("product_media");

      if (tableDefinition && tableDefinition["status"]) {
          await queryInterface.removeColumn("product_media", "status");
      }
  },
};
