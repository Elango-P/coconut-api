module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_activity");

    if (tableDefinition && !tableDefinition["shift_id"]) {
      await queryInterface.addColumn("recurring_activity", "shift_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["location_id"]) {
      await queryInterface.addColumn("recurring_activity", "location_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("recurring_activity");

    if (tableDefinition && tableDefinition["shift_id"]) {
      await queryInterface.removeColumn("recurring_activity", "shift_id");
    }

    if (tableDefinition && tableDefinition["location_id"]) {
      await queryInterface.removeColumn("recurring_activity", "location_id");
    }
  
  },
};