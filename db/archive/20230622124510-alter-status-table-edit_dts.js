const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding allow_edit");
      
      const tableDefinition = await queryInterface.describeTable("status");

      if (tableDefinition && !tableDefinition["allow_edit"]) {
          await queryInterface.addColumn("status", "allow_edit", {
              allowNull: true,
              type: Sequelize.INTEGER,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding allow_edit");
      const tableDefinition = await queryInterface.describeTable("status");

      if (tableDefinition && tableDefinition["allow_edit"]) {
          await queryInterface.removeColumn("status", "allow_edit");
      }
  },
};