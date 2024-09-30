module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");

    if (tableDefinition && !tableDefinition["draft_order_amount"]) {
      await queryInterface.addColumn("sale_settlement", "draft_order_amount", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");

    if (tableDefinition && tableDefinition["draft_order_amount"]) {
      await queryInterface.removeColumn("sale_settlement", "draft_order_amount");
    }
  
  },
};