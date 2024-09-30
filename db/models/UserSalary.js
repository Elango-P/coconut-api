module.exports = (sequelize, DataTypes) => {
	const User = require("./User")(sequelize, DataTypes);
	const UserProfile = require("./UserProfile")(sequelize, DataTypes);

	const UserSalary = sequelize.define("UserSalary", {
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
		ctc: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		house_rent_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		conveyance_allowance: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		medical_reimbursement: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		telephone_reimbursement: {
			type: DataTypes.DECIMAL,
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
		medical_insurance_premium: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		provident_fund_users: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		provident_fund_user: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		user_contribution: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		gratuity: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		annual_bonus: {
			type: DataTypes.DECIMAL,
			allowNull: true
		},
		start_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		end_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "user_salary",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: "deleted_at",
		paranoid:true
	});

	UserSalary.belongsTo(User, { as: "user", foreignKey: "user_id" });
	UserSalary.belongsTo(UserProfile, { as: "userProfile", foreignKey: "user_id" });

	return UserSalary;
};
