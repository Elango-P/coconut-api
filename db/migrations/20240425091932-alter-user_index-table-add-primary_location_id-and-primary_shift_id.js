module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && !tableDefinition["primary_location_id"]) {
      await queryInterface.addColumn("user_index", "primary_location_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["primary_shift_id"]) {
      await queryInterface.addColumn("user_index", "primary_shift_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_index");

    if (tableDefinition && tableDefinition["primary_location_id"]) {
      await queryInterface.removeColumn("user_index", "primary_location_id");
    }

    if (tableDefinition && tableDefinition["primary_shift_id"]) {
      await queryInterface.removeColumn("user_index", "primary_shift_id");
    }
  
  },
};
