
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding Manufactured Date");
      
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      if (tableDefinition && !tableDefinition["manufactured_date"]) {
          await queryInterface.addColumn("purchase_product", "manufactured_date", {
              type: Sequelize.DATE,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      if (tableDefinition && tableDefinition["manufactured_date"]) {
          await queryInterface.removeColumn("purchase_product", "manufactured_date");
      }
  },
};