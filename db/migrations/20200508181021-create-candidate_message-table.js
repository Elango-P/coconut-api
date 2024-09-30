exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating candidate_message table");

    // Defining whether the candidate_message table already exist or not.
    const candidateMessageTableExists = await queryInterface.tableExists("candidate_message");

    // Condition for creating the candidate_message table only if the table doesn't exist already.
    if (!candidateMessageTableExists) {
      await queryInterface.createTable("candidate_message", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        from_email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        to_email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        candidate_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the candidate_message table already exist or not.
    const candidateMessageTableExists = await queryInterface.tableExists("candidate_message");

    // Condition for dropping the candidate_message table only if the table exist already.
    if (candidateMessageTableExists) {
      await queryInterface.dropTable("candidate_message");
    };
  } catch (err) {
    console.log(err);
  };
};
