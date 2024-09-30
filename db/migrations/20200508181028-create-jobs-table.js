exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating jobs table");

    // Defining whether the jobs table already exist or not.
    const jobsTableExists = await queryInterface.tableExists("jobs");

    // Condition for creating the jobs table only if the table doesn't exist already.
    if (!jobsTableExists) {
      await queryInterface.createTable("jobs", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        category: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sub_category: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        job_title: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        slug: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        job_type: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        experience: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        job_description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        mandatory_skills: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        responsibilities: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        requirements: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        minimum_experience: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        maximum_experience: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        maximum_salary: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        course_name: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        project_name: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        show_project_details: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_course_details: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_current_address: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_home_town_address: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_skills: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_expected_salary: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_current_salary: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_employment_eligibility: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        show_employment: {
          type: Sequelize.BOOLEAN,
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
        show_vaccine_status: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the jobs table already exist or not.
    const jobsTableExists = await queryInterface.tableExists("jobs");

    // Condition for dropping the jobs table only if the table exist already.
    if (jobsTableExists) {
      await queryInterface.dropTable("jobs");
    };
  } catch (err) {
    console.log(err);
  };
};
