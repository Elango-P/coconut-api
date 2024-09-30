
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding  the designation");
      
      const tableDefinition = await queryInterface.describeTable("contact");

      if (tableDefinition && !tableDefinition["designation"]) {
          await queryInterface.addColumn("contact", "designation", {
              type: Sequelize.STRING,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("contact");

      if (tableDefinition && tableDefinition["designation"]) {
          await queryInterface.removeColumn("contact", "designation");
      }
  },
};
