module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["rating"]) {
      await queryInterface.addColumn("user", "rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["rating"]) {
      await queryInterface.removeColumn("user", "rating");
    }
  
  },
};
