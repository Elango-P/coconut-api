const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding gst_status");
      
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && !tableDefinition["gst_status"]) {
          await queryInterface.addColumn("bill", "gst_status", {
              allowNull: true,
              type: Sequelize.STRING,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding gst_status");
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && tableDefinition["gst_status"]) {
          await queryInterface.removeColumn("bill", "gst_status");
      }
  },
};