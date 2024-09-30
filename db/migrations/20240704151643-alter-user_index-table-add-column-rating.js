module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && !tableDefinition["rating"]) {
      await queryInterface.addColumn("user_index", "rating", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && tableDefinition["rating"]) {
      await queryInterface.removeColumn("user_index", "rating");
    }
  
  },
};
