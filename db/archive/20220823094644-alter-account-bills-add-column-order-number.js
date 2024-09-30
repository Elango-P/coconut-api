"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding due order_number to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && !tableDefinition["order_number"]) {
            await queryInterface.addColumn("accounts_bill", "order_number", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.removeColumn("accounts_bill", "order_number");
        }
    },
};
