"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable(
        "order"
      );
      if (tableDefinition && tableDefinition["shift"]) {
        return queryInterface.changeColumn(
          "order",
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
      "order",
      "shift",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },
};