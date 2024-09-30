module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && !tableDefinition["account_id"]) {
      await queryInterface.addColumn("user_index", "account_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && tableDefinition["account_id"]) {
      await queryInterface.removeColumn("user_index", "account_id");
    }
  
  },
};
