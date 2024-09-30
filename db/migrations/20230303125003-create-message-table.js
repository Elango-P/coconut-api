exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log('Creating message table');

    // Defining whether the contact table already exist or not.
    const messageTableExists = await queryInterface.tableExists('message');

    // Condition for creating the contact table only if the table doesn't exist already.
    if (!messageTableExists) {
      await queryInterface.createTable('message', {
   
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        message: {
          type: Sequelize.STRING,
          allowNull: true
        },
        object_id: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        object_name : {
          type: Sequelize.STRING,  
          allowNull: true
        },
        createdAt: {
            allowNull: true,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: true,
            type: Sequelize.DATE
        },
        deletedAt: {
            allowNull: true,
            type: Sequelize.DATE
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        reciever_user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        read_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the contact table already exist or not.
    const messageTableExists = await queryInterface.tableExists('message');

    // Condition for dropping the contact table only if the table exist already.
    if ( messageTableExists) {
      await queryInterface.dropTable('message');
    }
  } catch (err) {
    console.log(err);
  }
};

