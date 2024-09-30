'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
    const tableDefinition = await queryInterface.describeTable("system_log");

    if (tableDefinition && !tableDefinition["object"]) {
        queryInterface.addColumn("system_log", "object", {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    }
  } catch (err) {
    console.log(err);
  }
  },

  down: async(queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("system_log");

    if (tableDefinition && tableDefinition["object"]) {
      queryInterface.removeColumn("system_log", "object");
  }
  }
};
