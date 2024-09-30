module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);

	const SalaryMonthly = sequelize.define("SalaryMonthly", {
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
		basic_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		house_rent_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		conveyance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		medical_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		telephone_allowance: {
			type: DataTypes.STRING,
			allowNull: true
		},
		leave_travel_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		special_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		night_shift_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		medical_insurance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		provident_fund: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		user_state_insurance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gratuity: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		cost_to_company: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		additional_days: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		additional_days_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		additional_bonus: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		absent_days: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		lop_for_absent: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		late_hours_days: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		late_hours_deduction: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		loan_deduction: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gross_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		professional_tax: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		tds: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		net_salary: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		tableName: "salary_monthly",
		timestamps: true,
		paranoid: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at"
	});

	SalaryMonthly.belongsTo(User, { as: "user", foreignKey: "user_id" });

	return SalaryMonthly;
};
