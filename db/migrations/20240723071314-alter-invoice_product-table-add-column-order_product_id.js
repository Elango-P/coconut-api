module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice_product");

    if (tableDefinition && !tableDefinition["order_product_id"]) {
      await queryInterface.addColumn("invoice_product", "order_product_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("invoice_product");

    if (tableDefinition && tableDefinition["order_product_id"]) {
      await queryInterface.removeColumn("invoice_product", "order_product_id");
    }
  
  },
};