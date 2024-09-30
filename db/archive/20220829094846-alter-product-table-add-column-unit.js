"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding unit column");
        
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && !tableDefinition["unit"]) {
            await queryInterface.addColumn("product", "unit", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["unit"]) {
            await queryInterface.removeColumn("product", "unit");
        }
    },
};
