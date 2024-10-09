

module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Status = require("./status")(sequelize, DataTypes);
	const Salary = sequelize.define("Salary", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		working_days: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		worked_days: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		additional_days: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		basic: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gratuity: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		updatedAt: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		deletedAt: {
			allowNull: true,
			type: DataTypes.DATE,
		},
		hra: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		leave: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		absent: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		medical_insurance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		net_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		company_id: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		professional_tax: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		special_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		monthly_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		standard_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		unPaid_leaves: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		salary_number: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		bonus: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		salary_per_day: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		tds: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		provident_fund: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		other_deductions: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		leave_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		additional_day_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		status: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		fine: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		additional_hours: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		additional_hours_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		month: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true
		},
		worked_days_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		other_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		attendance: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	}, {
		tableName: "salary",
		timestamps: true,
		created_at: "createdAt",
		updated_at: "updatedAt",
		deleted_at: true,
		paranoid: true,
	});

	Salary.belongsTo(User, { as: "user", foreignKey: "user_id" });
	Salary.belongsTo(Status, { as: "statusDetail", foreignKey: "status" });
	return Salary;
};