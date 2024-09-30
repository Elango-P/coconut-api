"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("country");

        // change company id data type string to integer
        if (tableDefinition && !tableDefinition["company_id"]) {
          await queryInterface.addColumn("country", "company_id",{
            type: Sequelize.INTEGER,
            allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("country");

        if (tableDefinition && tableDefinition["company_id"]) {
          await queryInterface.removeColumn("country", "company_id");
      }
    },
};