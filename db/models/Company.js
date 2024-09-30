module.exports = 
    (sequelize, DataTypes) => {
        const company = sequelize.define(
            "company",
            {
                company_name: {
                    type: DataTypes.STRING,
                },
                status: DataTypes.STRING,
                websiteurl: DataTypes.STRING,
                description: DataTypes.STRING,
                email: DataTypes.STRING,
                company_logo: DataTypes.STRING,
                mobile_number1: DataTypes.STRING,
                mobile_number2: DataTypes.STRING,
                address1: DataTypes.TEXT,
                address2: DataTypes.TEXT,
                city: DataTypes.STRING,
                state: DataTypes.STRING,
                country: DataTypes.STRING,
                pin_code: DataTypes.STRING,
                facebook_url: DataTypes.STRING,
                instagram_url: DataTypes.STRING,
                twitter_url: DataTypes.STRING,
                linkedIn_url: DataTypes.STRING,
                youtube_url: DataTypes.STRING,
                portal_url: DataTypes.STRING,
                portal_api_url: DataTypes.STRING,
                template: DataTypes.STRING,
                gst_number: DataTypes.STRING,
                time_zone : DataTypes.STRING
            },
            {
                freezeTableName: true,
                paranoid: true,
            }
        );
        return company;
    };
    
