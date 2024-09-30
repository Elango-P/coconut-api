module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");

    if (tableDefinition && !tableDefinition["object_status"]) {
      await queryInterface.addColumn("scheduler_job", "object_status", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["object_name"]) {
      await queryInterface.addColumn("scheduler_job", "object_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["date_type"]) {
      await queryInterface.addColumn("scheduler_job", "date_type", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("scheduler_job");

    if (tableDefinition && tableDefinition["object_status"]) {
      await queryInterface.removeColumn("scheduler_job", "object_status");
    }

    if (tableDefinition && tableDefinition["object_name"]) {
      await queryInterface.removeColumn("scheduler_job", "object_name");
    }

    if (tableDefinition && tableDefinition["date_type"]) {
      await queryInterface.removeColumn("scheduler_job", "date_type");
    }
  },
};
