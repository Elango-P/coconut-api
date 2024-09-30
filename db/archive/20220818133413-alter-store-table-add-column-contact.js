module.exports = {
  up: async (queryInterface, Sequelize) => {
      const tableDefinition = await queryInterface.describeTable("store");

      if (tableDefinition && !tableDefinition["email"]) {
          await queryInterface.addColumn("store", "email", {
              type: Sequelize.STRING,
              allowNull: true,
          });
        }


        if (tableDefinition && !tableDefinition["mobile_number1"]) {
          await queryInterface.addColumn("store", "mobile_number1", {
              type: Sequelize.STRING,
              allowNull: true,
          });
        }


        if (tableDefinition && !tableDefinition["mobile_number2"]) {
          await queryInterface.addColumn("store", "mobile_number2", {
              type: Sequelize.STRING,
              allowNull: true,
          });
        }

        
      }
        
    };