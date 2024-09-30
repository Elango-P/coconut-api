module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('bill');

    if (tableDefinition && !tableDefinition['created_by']) {
      await queryInterface.addColumn('bill', 'created_by', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('bill');

    if (tableDefinition && tableDefinition['created_by']) {
      await queryInterface.removeColumn('bill', 'created_by');
    }
  
  },
};
