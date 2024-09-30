"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Changing data type of date as date in sale table");
        
        const tableDefinition = await queryInterface.describeTable("sale");

        if (tableDefinition && tableDefinition["date"]) {
            await queryInterface.changeColumn("sale", "date", {
                type: Sequelize.DATEONLY,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("sale");

        if (tableDefinition && tableDefinition["date"]) {
            await queryInterface.changeColumn("sale", "date", {
            type: Sequelize.DATE,
            allowNull: true,
        });
        }
    },
};
