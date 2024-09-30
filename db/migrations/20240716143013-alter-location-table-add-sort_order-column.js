module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && !tableDefinition["sort_order"]) {
      await queryInterface.addColumn("store", "sort_order", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store");

    if (tableDefinition && tableDefinition["sort_order"]) {
      await queryInterface.removeColumn("store", "sort_order");
    }
  
  },
};
