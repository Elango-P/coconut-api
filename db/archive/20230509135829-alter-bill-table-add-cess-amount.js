module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding cess to bill table");
      
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && !tableDefinition["cess_amount"]) {
          await queryInterface.addColumn("bill", "cess_amount", {
              allowNull: true,
              type: Sequelize.DECIMAL,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing cgst to bill table");
      const tableDefinition = await queryInterface.describeTable("bill");

      if (tableDefinition && tableDefinition["cess_amount"]) {
          await queryInterface.removeColumn("bill", "cess_amount");
      }
  },
};
