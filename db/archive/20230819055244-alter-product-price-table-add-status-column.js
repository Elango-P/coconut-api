"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding product price table ");
        
        const tableDefinition = await queryInterface.describeTable("product_price");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("product_price", "status", {
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

        if (tableDefinition && tableDefinition["product_price"]) {
            await queryInterface.removeColumn("product_price", "product_price");
        }
    },
};
