module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const Payroll = sequelize.define("Payroll", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		month: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false
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
		story_points: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		basic_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		additional_days_bonus: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		loss_of_pay_amount: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		loan_deduction: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		net_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gross_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		pan_number: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		snacks: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		professional_tax: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		medical_allowance: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		performance_bonus: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		gratuity: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		hra: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		tds: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		paid_leaves: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		unpaid_leaves: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		current_month_salary: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		conveyance_allowance: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		special_allowance: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		bank_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		bank_account_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		late_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_earning: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		total_deductions: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "payroll",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});
	Payroll.belongsTo(User, { as: "user", foreignKey: "user_id" });
	return Payroll;
};
