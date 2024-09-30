"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding max_quantity in product");
        
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && !tableDefinition["max_quantity"]) {
            await queryInterface.addColumn("product", "max_quantity", {
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

        if (tableDefinition && tableDefinition["max_quantity"]) {
            await queryInterface.removeColumn("product", "max_quantity");
        }

    },
};
