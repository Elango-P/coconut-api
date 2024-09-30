"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding due payment_type to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && !tableDefinition["payment_type"]) {
            await queryInterface.addColumn("accounts_bill", "payment_type", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && tableDefinition["payment_type"]) {
            await queryInterface.removeColumn("accounts_bill", "payment_type");
        }
    },
};
