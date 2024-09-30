'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding is_default");
      
      const tableDefinition = await queryInterface.describeTable("product_price");

      if (tableDefinition && !tableDefinition["is_default"]) {
          await queryInterface.addColumn("product_price", "is_default", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("product_price");

      if (tableDefinition && tableDefinition["is_default"]) {
          await queryInterface.removeColumn("product_price", "is_default");
      }
  },
};