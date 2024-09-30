const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding status");
      
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      if (tableDefinition && !tableDefinition["status"]) {
          await queryInterface.addColumn("stock_entry_product", "status", {
              allowNull: true,
              type: Sequelize.INTEGER,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding status");
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      if (tableDefinition && tableDefinition["status"]) {
          await queryInterface.removeColumn("stock_entry_product", "status");
      }
  },
};