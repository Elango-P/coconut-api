exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating candidate table");

    // Defining whether the candidate_profile table already exist or not.
    const candidateProfileTableExists = await queryInterface.tableExists("candidate");

    // Condition for creating the candidate_profile table only if the table doesn't exist already.
    if (!candidateProfileTableExists) {
      await queryInterface.createTable("candidate", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        marital_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        age: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_area: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_country: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_state: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_pincode: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        permanent_country: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        permanent_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        permanent_area: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        permanent_city: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        permanent_state: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        permanent_pincode: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        qualification: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        department: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        year_of_passing: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        position: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        overall_experience: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        project_title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        project_period: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        project_description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        course_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        course_period: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        course_institution: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        current_salary: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        expected_salary: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        file: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        percentage: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        position_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        dob: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        relevant_experience: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        expected_cost_per_hour: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        job_reference_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        job_reference_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        willing_to_work_in_shift: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        skills: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        staying_with: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        interview_date: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        tenth_year_of_passing: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tenth_percentage: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        twelveth_year_of_passing: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        twelveth_percentage: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        degree_arrear: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        did_course: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        did_project: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        linkedin_profile_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        facebook_profile_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        job_title: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        joined_month: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        joined_year: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        known_languages: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        employment_eligibility: {
          type: Sequelize.STRING,
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
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        vaccine_status: {
          allowNull: true,
          type: Sequelize.STRING,
        },
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the candidate_profile table already exist or not.
    const candidateProfileTableExists = await queryInterface.tableExists("candidate");
    
    // Condition for dropping the candidate_profile table only if the table exist already.
    if (candidateProfileTableExists) {
      await queryInterface.dropTable("candidate");
    };
  } catch (err) {
    console.log(err);
  };
};
