"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Changing data type of product_id as product_id in order_product table");
        
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && tableDefinition["product_id"]) {
            await queryInterface.changeColumn("order_product", "product_id", {
                type: Sequelize.BIGINT,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order_product");

        if (tableDefinition && tableDefinition["product_id"]) {
            await queryInterface.changeColumn("order_product", "product_id", {
            type: Sequelize.BIGINT,
            allowNull: true,
        });
        }
    },
};
