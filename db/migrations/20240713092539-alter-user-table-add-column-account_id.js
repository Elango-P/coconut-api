module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["account_id"]) {
      await queryInterface.addColumn("user", "account_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["account_id"]) {
      await queryInterface.removeColumn("user", "account_id");
    }
  
  },
};
