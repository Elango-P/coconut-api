module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding sgst to bill table");
        
        const tableDefinition = await queryInterface.describeTable("bill");

        if (tableDefinition && !tableDefinition["sgst_amount"]) {
            await queryInterface.addColumn("bill", "sgst_amount", {
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

        if (tableDefinition && tableDefinition["sgst_amount"]) {
            await queryInterface.removeColumn("bill", "sgst_amount");
        }
    },
};