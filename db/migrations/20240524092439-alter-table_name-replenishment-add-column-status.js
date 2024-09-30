"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Changing data type of status as status in replenishment table");
        
        const tableDefinition = await queryInterface.describeTable("replenishment");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("replenishment", "status", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("replenishment");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("replenishment", "status", {
            type: Sequelize.DECIMAL,
            allowNull: true,
        });
        }
    },
};
