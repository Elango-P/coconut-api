module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["year"]) {
      await queryInterface.addColumn("salary", "year", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["month"]) {
      await queryInterface.addColumn("salary", "month", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["notes"]) {
      await queryInterface.addColumn("salary", "notes", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["year"]) {
      await queryInterface.removeColumn("salary", "year");
    }
    if (tableDefinition && tableDefinition["month"]) {
      await queryInterface.removeColumn("salary", "month");
    }
    if (tableDefinition && tableDefinition["notes"]) {
      await queryInterface.removeColumn("salary", "notes");
    }
  
  },
};