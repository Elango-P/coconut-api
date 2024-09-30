
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account salary table - Renaming column lop to leave_salary");
      return queryInterface.describeTable("salary").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["lop"]) {
          return queryInterface.renameColumn("salary", "lop", "leave_salary");
        } else {
          return Promise.resolve(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable(
        "salary"
    );
    if (tableDefinition && tableDefinition["leave_salary"]) {
        await queryInterface.renameColumn(
            "leave_salary",
            "lop",
            {
              type: Sequelize.DATEONLY,
              allowNull: true,
            }
        );
    }
},
}