module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding allowed_shifts in  user_role");
      
      const tableDefinition = await queryInterface.describeTable("user_role");

      if (tableDefinition && !tableDefinition["allowed_shifts"]) {
          await queryInterface.addColumn("user_role", "allowed_shifts", {
              type: Sequelize.STRING,
              allowNull: true,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing allowed_shifts in  user_role");
    const tableDefinition = await queryInterface.describeTable("user_role");

      if (tableDefinition && tableDefinition["allowed_shifts"]) {
          await queryInterface.removeColumn("user_role", "allowed_shifts");
      }
  },
};