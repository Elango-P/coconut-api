"use strict";
exports.up = async function up(queryInterface, Sequelize) {
    try {
        // Console log
        console.log("Creating jobs_email_template table");

        // Defining whether the jobs_email_template table already exist or not.
        const jobsEmailTemplateTableExists = await queryInterface.tableExists("jobs_email_template");

        // Condition for creating the jobs_email_template table only if the table doesn't exist already.
        if (!jobsEmailTemplateTableExists) {
            await queryInterface.createTable("jobs_email_template", {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                content: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                company_id : {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: true,
                    type: Sequelize.DATE,
                },
                deletedAt: {
                    allowNull: true,
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
        // Defining whether the jobs_email_template table already exist or not.
        const jobsEmailTemplateTableExists = await queryInterface.tableExists("jobs_email_template");
  
        // Condition for dropping the jobs_email_template table only if the table exist already.
        if (jobsEmailTemplateTableExists) {
          await queryInterface.dropTable("jobs_email_template");
        };
    } catch (err) {
        console.log(err);
    };
};
