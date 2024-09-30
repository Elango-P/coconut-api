'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && !tableDefinition["type"]) {
      await queryInterface.addColumn("scheduler_job", "type", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["day"]) {
      await queryInterface.addColumn("scheduler_job", "day", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["month"]) {
      await queryInterface.addColumn("scheduler_job", "month", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["week"]) {
      await queryInterface.addColumn("scheduler_job", "week", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

    if (tableDefinition && !tableDefinition["date"]) {
      await queryInterface.addColumn("scheduler_job", "date", {
          type: Sequelize.DECIMAL,
          allowNull: true,
      });
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");
    if (tableDefinition && tableDefinition["type"]) {
      await queryInterface.removeColumn("scheduler_job", "type");
    }
    if (tableDefinition && tableDefinition["day"]) {
      await queryInterface.removeColumn("scheduler_job", "day");
    }
    if (tableDefinition && tableDefinition["month"]) {
      await queryInterface.removeColumn("scheduler_job", "month");
    }
    if (tableDefinition && tableDefinition["week"]) {
      await queryInterface.removeColumn("scheduler_job", "week");
    }
    if (tableDefinition && tableDefinition["date"]) {
      await queryInterface.removeColumn("scheduler_job", "date");
    }
  },
};