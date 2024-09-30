"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding due transfer_number to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("inventory_transfer");

        if (tableDefinition && !tableDefinition["transfer_number"]) {
            await queryInterface.addColumn("inventory_transfer", "transfer_number", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory_transfer");

        if (tableDefinition && tableDefinition["transfer_number"]) {
            await queryInterface.removeColumn("inventory_transfer", "transfer_number");
        }
    },
};
