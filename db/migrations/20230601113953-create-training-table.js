exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating training table");

    // Defining whether the training table already exist or not.
    const trainingTableExists = await queryInterface.tableExists("training");

    // Condition for creating the training table only if the table doesn't exist already.
    if (!trainingTableExists) {
      await queryInterface.createTable("training", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        training_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        banner_image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        course_file: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sharing_permission: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        send_notification: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        link_course_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
  } catch (err) {
    console.log(err);
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the training table already exist or not.
    const trainingTableExists = await queryInterface.tableExists("training");

    // Condition for dropping the training table only if the table exist already.
    if (trainingTableExists) {
      await queryInterface.dropTable("training");
    };
  } catch (err) {
    console.log(err);
  };
};
