module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["worked_days_salary"]) {
      await queryInterface.addColumn("salary", "worked_days_salary", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["other_allowance"]) {
      await queryInterface.addColumn("salary", "other_allowance", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && tableDefinition["worked_days_salary"]) {
      await queryInterface.removeColumn("salary", "worked_days_salary");
    }
    if (tableDefinition && tableDefinition["other_allowance"]) {
      await queryInterface.removeColumn("salary", "other_allowance");
    }
  
  },
};