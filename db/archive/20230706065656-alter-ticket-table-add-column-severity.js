module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && !tableDefinition['type_id']) {
      await queryInterface.addColumn('ticket', 'type_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['severity_id']) {
      await queryInterface.addColumn('ticket', 'severity_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['priority']) {
      await queryInterface.addColumn('ticket', 'priority', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['acceptance_criteria']) {
      await queryInterface.addColumn('ticket', 'acceptance_criteria', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['environment']) {
      await queryInterface.addColumn('ticket', 'environment', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition['test_step']) {
      await queryInterface.addColumn('ticket', 'test_step', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['actual_results']) {
      await queryInterface.addColumn('ticket', 'actual_results', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['expected_results']) {
      await queryInterface.addColumn('ticket', 'expected_results', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['story_points']) {
      await queryInterface.addColumn('ticket', 'story_points', {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['reviewer']) {
      await queryInterface.addColumn('ticket', 'reviewer', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['completed_at']) {
      await queryInterface.addColumn('ticket', 'completed_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['actual_hours']) {
      await queryInterface.addColumn('ticket', 'actual_hours', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition['system_hours']) {
      await queryInterface.addColumn('ticket', 'system_hours', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('ticket');

    if (tableDefinition && tableDefinition['type_id']) {
      await queryInterface.removeColumn('ticket', 'type_id');
    }
    if (tableDefinition && tableDefinition['severity_id']) {
      await queryInterface.removeColumn('ticket', 'severity_id');
    }
    if (tableDefinition && tableDefinition['priority']) {
      await queryInterface.removeColumn('ticket', 'priority');
    }
    if (tableDefinition && tableDefinition['acceptance_criteria']) {
      await queryInterface.removeColumn('ticket', 'acceptance_criteria');
    }
    if (tableDefinition && tableDefinition['environment']) {
      await queryInterface.removeColumn('ticket', 'environment');
    }
    if (tableDefinition && tableDefinition['test_step']) {
      await queryInterface.removeColumn('ticket', 'test_step');
    }
    if (tableDefinition && tableDefinition['actual_results']) {
      await queryInterface.removeColumn('ticket', 'actual_results');
    }
    if (tableDefinition && tableDefinition['expected_results']) {
      await queryInterface.removeColumn('ticket', 'expected_results');
    }
    if (tableDefinition && tableDefinition['story_points']) {
      await queryInterface.removeColumn('ticket', 'story_points');
    }
    if (tableDefinition && tableDefinition['reviewer']) {
      await queryInterface.removeColumn('ticket', 'reviewer');
    }
    if (tableDefinition && tableDefinition['completed_at']) {
      await queryInterface.removeColumn('ticket', 'completed_at');
    }
    if (tableDefinition && tableDefinition['actual_hours']) {
      await queryInterface.removeColumn('ticket', 'actual_hours');
    }
    if (tableDefinition && tableDefinition['system_hours']) {
      await queryInterface.removeColumn('ticket', 'system_hours');
    }
  },
};
