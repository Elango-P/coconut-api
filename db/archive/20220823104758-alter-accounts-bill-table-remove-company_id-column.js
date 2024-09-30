"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        // change company id data type string to integer
        if (tableDefinition && tableDefinition["company_id"]) {
          await queryInterface.removeColumn("accounts_bill", "company_id");
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && tableDefinition["company_id"]) {
          await queryInterface.addColumn("accounts_bill", "company_id", {
              type: Sequelize.INTEGER,
          });
      }
    },
};
