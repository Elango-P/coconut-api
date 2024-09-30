module.exports = (sequelize, DataTypes) => {
  const accountAgreementSchema = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agreement_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    agreement_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    agreement_renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    agreement_term: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agreement_term: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    agreement_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
  };

  const account_agreement = sequelize.define('account_agreement', accountAgreementSchema, {
    sequelize,
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  });

  return account_agreement;
};
