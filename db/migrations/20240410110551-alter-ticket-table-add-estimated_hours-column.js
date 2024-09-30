module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && !tableDefinition['estimated_hours']) {
      await queryInterface.addColumn('ticket', 'estimated_hours', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && tableDefinition['estimated_hours']) {
      await queryInterface.removeColumn('ticket', 'estimated_hours');
    }
  
  },
};
