

module.exports = (sequelize, DataTypes) =>{
	const status = require("./status")(sequelize, DataTypes);
	const media = require("./Media")(sequelize, DataTypes);

const Candidate = sequelize.define("candidate", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		media_id : {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		owner_id : {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: true
		},
		marital_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_area: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_country: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_city: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_pincode: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		permanent_country: {
			type: DataTypes.STRING,
			allowNull: true
		},
		permanent_address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		permanent_area: {
			type: DataTypes.STRING,
			allowNull: true
		},
		permanent_city: {
			type: DataTypes.STRING,
			allowNull: true
		},
		permanent_state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		permanent_pincode: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		qualification: {
			type: DataTypes.STRING,
			allowNull: true
		},
		department: {
			type: DataTypes.STRING,
			allowNull: true
		},
		year_of_passing: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		position: {
			type: DataTypes.STRING,
			allowNull: true
		},
		overall_experience: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		project_title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		project_period: {
			type: DataTypes.STRING,
			allowNull: true
		},
		project_description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		course_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		course_period: {
			type: DataTypes.STRING,
			allowNull: true
		},
		course_institution: {
			type: DataTypes.STRING,
			allowNull: true
		},
		current_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		expected_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		file: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		percentage: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		position_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		dob: {
			type: DataTypes.DATE,
			allowNull: true
		},
		relevant_experience: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		expected_cost_per_hour: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		job_reference_type: {
			type: DataTypes.STRING,
			allowNull: true
		},
		job_reference_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		willing_to_work_in_shift: {
			type: DataTypes.STRING,
			allowNull: true
		},
		skills: {
			type: DataTypes.JSON,
			allowNull: true
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: true
		},
		staying_with: {
			type: DataTypes.STRING,
			allowNull: true
		},
		interview_date: {
			type: DataTypes.STRING,
			allowNull: true
		},
		tenth_year_of_passing: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tenth_percentage: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		twelveth_year_of_passing: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		twelveth_percentage: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		degree_arrear: {
			type: DataTypes.STRING,
			allowNull: true
		},
		did_course: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		did_project: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		linkedin_profile_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		facebook_profile_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		job_title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		joined_month: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		joined_year: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		known_languages: {
			type: DataTypes.STRING,
			allowNull: true
		},
		employment_eligibility: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updated_at: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		deleted_at: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		vaccine_status: {
			allowNull: true,
			type: DataTypes.STRING,
		}
	}, {
		tableName: "candidate",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: false
	});
	Candidate.belongsTo(status, {
		as: "statusDetail",
		foreignKey: "status"
	});
	Candidate.belongsTo(media, {
		as: "media",
		foreignKey: "media_id",
	});
	return Candidate
}