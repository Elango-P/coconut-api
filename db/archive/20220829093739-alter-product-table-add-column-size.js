"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding size in product");
        
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && !tableDefinition["size"]) {
            await queryInterface.addColumn("product", "size", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("size");

        if (tableDefinition && tableDefinition["size"]) {
            await queryInterface.removeColumn("product", "size");
        }
    },
};
