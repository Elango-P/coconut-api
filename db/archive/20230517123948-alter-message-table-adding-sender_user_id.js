module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding reciever_user_id and read_at to message table");
  
      const tableDefinition = await queryInterface.describeTable("message");
  
      if (tableDefinition && !tableDefinition["reciever_user_id"]) {
        await queryInterface.addColumn("message", "reciever_user_id", {
          allowNull: true,
          type: Sequelize.INTEGER,
        });
      }
  
      if (tableDefinition && !tableDefinition["read_at"]) {
        await queryInterface.addColumn("message", "read_at", {
          allowNull: true,
          type: Sequelize.DATE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: Removing reciever_user_id and read_at from message table");
  
    const tableDefinition = await queryInterface.describeTable("message");
  
    if (tableDefinition && tableDefinition["reciever_user_id"]) {
      await queryInterface.removeColumn("message", "reciever_user_id");
    }
  
    if (tableDefinition && tableDefinition["read_at"]) {
      await queryInterface.removeColumn("message", "read_at");
    }
  },
  
};
