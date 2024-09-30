'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["company_id"]) {
        queryInterface.addColumn("user", "company_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    }
  } catch (err) {
    console.log(err);
  }
  },

  down: async(queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["company_id"]) {
      queryInterface.removeColumn("user", "company_id");
  }
  }
};
