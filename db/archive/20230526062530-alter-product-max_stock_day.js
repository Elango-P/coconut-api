'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding max_stock_days");
      
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && !tableDefinition["max_stock_days"]) {
          await queryInterface.addColumn("product", "max_stock_days", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("product");

      if (tableDefinition && tableDefinition["max_stock_days"]) {
          await queryInterface.removeColumn("product", "max_stock_days");
      }
  },
};
