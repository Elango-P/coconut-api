"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table:  Add column in sale_settlement table");
        
        const tableDefinition = await queryInterface.describeTable("sale_settlement");

        if (tableDefinition && !tableDefinition["reviewer"]) {
            await queryInterface.addColumn("sale_settlement", "reviewer", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["due_date"]) {
          await queryInterface.addColumn("sale_settlement", "due_date", {
              type: Sequelize.DATEONLY,
              allowNull: true,
          });
      }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("sale_settlement");

        if (tableDefinition && tableDefinition["reviewer"]) {
            await queryInterface.removeColumn("sale_settlement", "reviewer", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        }
        if (tableDefinition && tableDefinition["due_date"]) {
          await queryInterface.removeColumn("sale_settlement", "due_date", {
          type: Sequelize.DATEONLY,
          allowNull: true,
      });
      }
    },
};
