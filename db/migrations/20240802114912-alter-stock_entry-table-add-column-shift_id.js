module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");

    if (tableDefinition && !tableDefinition["shift_id"]) {
      await queryInterface.addColumn("stock_entry", "shift_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("stock_entry");

    if (tableDefinition && tableDefinition["shift_id"]) {
      await queryInterface.removeColumn("stock_entry", "shift_id");
    }
  
  },
};