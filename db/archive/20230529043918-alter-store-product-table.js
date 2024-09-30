'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding order min quantity and order max quantity");
      
      const tableDefinition = await queryInterface.describeTable("store_product");

      if (tableDefinition && !tableDefinition["min_order_quantity"]) {
          await queryInterface.addColumn("store_product", "min_order_quantity", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }


      if (tableDefinition && !tableDefinition["max_order_quantity"]) {
        await queryInterface.addColumn("store_product", "max_order_quantity", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("store_product");

      if (tableDefinition && tableDefinition["min_order_quantity"]) {
          await queryInterface.removeColumn("store_product", "min_order_quantity");
      }

      if (tableDefinition && tableDefinition["max_order_quantity"]) {
        await queryInterface.removeColumn("store_product", "max_order_quantity");
    }
  },
};