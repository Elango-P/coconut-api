"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && !tableDefinition["allow_replenishment"]) {
        await queryInterface.addColumn("store", "allow_replenishment", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {

    try {
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && tableDefinition["allow_replenishment"]) {
        await queryInterface.removeColumn("store", "allow_replenishment");
      }
    } catch (err) {
      console.log(err);
    };

  }
};
