"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding payment_number to payment table");
        
        const tableDefinition = await queryInterface.describeTable("payment");

        if (tableDefinition && !tableDefinition["payment_number"]) {
            await queryInterface.addColumn("payment", "payment_number", {
                allowNull: true,
                type: Sequelize.INTEGER,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
      console.log("Alter Table: Removing payment_number to payment table");
        const tableDefinition = await queryInterface.describeTable("payment");

        if (tableDefinition && tableDefinition["payment_number"]) {
            await queryInterface.removeColumn("payment", "payment_number");
        }
    },
};