'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding color name");
      
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && !tableDefinition["color"]) {
          await queryInterface.addColumn("store", "color", {
              type: Sequelize.STRING,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && tableDefinition["color"]) {
          await queryInterface.removeColumn("store", "color");
      }
  },
};
