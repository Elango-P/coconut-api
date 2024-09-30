module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && !tableDefinition['estimated_hours']) {
      await queryInterface.addColumn('ticket_index', 'estimated_hours', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket_index');

    if (tableDefinition && tableDefinition['estimated_hours']) {
      await queryInterface.removeColumn('ticket_index', 'estimated_hours');
    }
  
  },
};
