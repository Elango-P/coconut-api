
"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Altering account purchase table - Renaming column bill date to purchase date");
      return queryInterface.describeTable("purchase").then((tableDefinition) => {
        if (tableDefinition && tableDefinition["bill_date"]) {
          return queryInterface.renameColumn("purchase", "bill_date", "purchase_date");
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
        "purchase"
    );
    if (tableDefinition && tableDefinition["purchase_date"]) {
        await queryInterface.renameColumn(
            "purchase_date",
            "bill_date",
            {
              type: Sequelize.DATEONLY,
              allowNull: true,
            }
        );
    }
},
}