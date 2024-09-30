const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding system quantity");
      
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      if (tableDefinition && !tableDefinition["system_quantity"]) {
          await queryInterface.addColumn("stock_entry_product", "system_quantity", {
              allowNull: true,
              type: Sequelize.INTEGER,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding system quantity");
      const tableDefinition = await queryInterface.describeTable("stock_entry_product");

      if (tableDefinition && tableDefinition["system_quantity"]) {
          await queryInterface.removeColumn("stock_entry_product", "system_quantity");
      }
  },
};