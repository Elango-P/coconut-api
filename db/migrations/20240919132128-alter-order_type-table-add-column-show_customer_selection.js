module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && !tableDefinition["show_customer_selection"]) {
      await queryInterface.addColumn("order_type", "show_customer_selection", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order_type");

    if (tableDefinition && tableDefinition["show_customer_selection"]) {
      await queryInterface.removeColumn("order_type", "show_customer_selection");
    }
  
  },
};