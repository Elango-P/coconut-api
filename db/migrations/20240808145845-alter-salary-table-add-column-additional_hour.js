module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["additional_hours"]) {
      await queryInterface.addColumn("salary", "additional_hours", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["additional_hours_salary"]) {
      await queryInterface.addColumn("salary", "additional_hours_salary", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["additional_hours"]) {
      await queryInterface.removeColumn("salary", "additional_hours");
    }
    if (tableDefinition && tableDefinition["additional_hours_salary"]) {
      await queryInterface.removeColumn("salary", "additional_hours_salary");
    }
  
  },
};