const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding deletedAt");
      
      const tableDefinition = await queryInterface.describeTable("ticket_comment");

      if (tableDefinition && !tableDefinition["deletedAt"]) {
          await queryInterface.addColumn("ticket_comment", "deletedAt", {
              allowNull: true,
              type: Sequelize.DATE,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding deletedAt");
      const tableDefinition = await queryInterface.describeTable("ticket_comment");

      if (tableDefinition && tableDefinition["deletedAt"]) {
          await queryInterface.removeColumn("ticket_comment", "deletedAt");
      }
  },
};
