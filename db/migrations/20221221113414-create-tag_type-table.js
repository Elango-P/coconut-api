module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating tag_type table");

      // Defining whether the tag_type table already exist or not.
      const tagTypeTableExists = await queryInterface.tableExists("tag_type");

      // Condition for creating the tag_type table only if the table doesn't exist already.
      if (!tagTypeTableExists) {
        await queryInterface.createTable("tag_type", {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          type: {
            type: Sequelize.STRING,
            allowNull: true
          },
          company_id : {
            type: Sequelize.INTEGER,  
            allowNull: false
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        });
      };
    } catch(err) {
      console.log(err);
    };
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the tag_type table already exist or not.
      const tagTypeTableExists = await queryInterface.tableExists("tag_type");

      // Condition for dropping the tag_type table only if the table exist already.
      if (tagTypeTableExists) {
        await queryInterface.dropTable("tag_type");
      };
    } catch (err) {
      console.log(err);
    };
  },
};