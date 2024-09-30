"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable(
        "sales"
      );
      if (tableDefinition && tableDefinition["shift"]) {
        return queryInterface.changeColumn(
          "sales",
          "shift",
          {
            type: 'INTEGER USING CAST("shift" as INTEGER)',
            allowNull: true,
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      "sales",
      "shift",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },
};