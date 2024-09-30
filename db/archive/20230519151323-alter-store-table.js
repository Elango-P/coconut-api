'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding print namer");
      
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && !tableDefinition["print_name"]) {
          await queryInterface.addColumn("store", "print_name", {
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

      if (tableDefinition && tableDefinition["print_name"]) {
          await queryInterface.removeColumn("store", "print_name");
      }
  },
};
