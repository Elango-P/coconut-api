'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
    const tableDefinition = await queryInterface.describeTable("system_log");

    if (tableDefinition && !tableDefinition["object_id"]) {
        queryInterface.addColumn("system_log", "object_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    }
  } catch (err) {
    console.log(err);
  }
  },

  down: async(queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("system_log");

    if (tableDefinition && tableDefinition["object_id"]) {
      queryInterface.removeColumn("system_log", "object_id");
  }
  }
};
