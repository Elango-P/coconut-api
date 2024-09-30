"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Changing data type of average_order_quantity as average_order_quantity in store_product table");
        
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && tableDefinition["average_order_quantity"]) {
            await queryInterface.changeColumn("store_product", "average_order_quantity", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && tableDefinition["average_order_quantity"]) {
            await queryInterface.changeColumn("store_product", "average_order_quantity", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
        }
    },
};
