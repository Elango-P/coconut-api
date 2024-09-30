module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && !tableDefinition['component_id']) {
      await queryInterface.addColumn('ticket', 'component_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && tableDefinition['component_id']) {
      await queryInterface.removeColumn('ticket', 'component_id');
    }
  },
};
