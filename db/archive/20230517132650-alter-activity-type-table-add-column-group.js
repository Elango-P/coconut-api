module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding group");
      
      const tableDefinition = await queryInterface.describeTable("activity_type");

      if (tableDefinition && !tableDefinition["group"]) {
          await queryInterface.addColumn("activity_type", "group", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding group");
      const tableDefinition = await queryInterface.describeTable("activity_type");

      if (tableDefinition && tableDefinition["group"]) {
          await queryInterface.removeColumn("activity_type", "group");
      }
  },
};