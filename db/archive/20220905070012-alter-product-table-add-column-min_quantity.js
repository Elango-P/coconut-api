"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding min_quantity in product");
        
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && !tableDefinition["min_quantity"]) {
            await queryInterface.addColumn("product", "min_quantity", {
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

        if (tableDefinition && tableDefinition["min_quantity"]) {
            await queryInterface.removeColumn("product", "min_quantity");
        }

    },
};
