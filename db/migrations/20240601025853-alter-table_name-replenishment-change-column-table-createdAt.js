"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Changing data type of createdAt as createdAt in replenishment table");
        
        const tableDefinition = await queryInterface.describeTable("replenishment");

        if (tableDefinition && tableDefinition["createdAt"]) {
            await queryInterface.changeColumn("replenishment", "createdAt", {
                type: Sequelize.DATE,
                allowNull: false,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("replenishment");

        if (tableDefinition && tableDefinition["createdAt"]) {
            await queryInterface.changeColumn("replenishment", "createdAt", {
            type: Sequelize.DATE,
            allowNull: false,
        });
        }
    },
};
