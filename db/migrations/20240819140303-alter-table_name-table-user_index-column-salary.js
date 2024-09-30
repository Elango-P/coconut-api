"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // remove emergency_mobile
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["emergency_mobile"]) {
        return queryInterface.removeColumn("user_index", "emergency_mobile");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove date_of_birth
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["date_of_birth"]) {
        return queryInterface.removeColumn("user_index", "date_of_birth");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove local_address
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["local_address"]) {
        return queryInterface.removeColumn("user_index", "local_address");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove permanent_address
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["permanent_address"]) {
        return queryInterface.removeColumn("user_index", "permanent_address");
      } else {
        return Promise.resolve(true);
      }
    });

    // remove parents_contact
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["parents_contact"]) {
        return queryInterface.removeColumn("user_index", "parents_contact");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["blood_group"]) {
        return queryInterface.removeColumn("user_index", "blood_group");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["pan_card"]) {
        return queryInterface.removeColumn("user_index", "pan_card");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["passport"]) {
        return queryInterface.removeColumn("user_index", "passport");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["voter_card"]) {
        return queryInterface.removeColumn("user_index", "voter_card");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["aadhar_card"]) {
        return queryInterface.removeColumn("user_index", "aadhar_card");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["cover_photo"]) {
        return queryInterface.removeColumn("user_index", "cover_photo");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["facebook_id"]) {
        return queryInterface.removeColumn("user_index", "facebook_id");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["google_id"]) {
        return queryInterface.removeColumn("user_index", "google_id");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["break_hour_start_time"]) {
        return queryInterface.removeColumn("user_index", "break_hour_start_time");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["break_hour_end_time"]) {
        return queryInterface.removeColumn("user_index", "break_hour_end_time");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["minimum_working_hours"]) {
        return queryInterface.removeColumn("user_index", "minimum_working_hours");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["salary"]) {
        return queryInterface.removeColumn("user_index", "salary");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["salary_per_day"]) {
        return queryInterface.removeColumn("user_index", "salary_per_day");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["band"]) {
        return queryInterface.removeColumn("user_index", "band");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["notice_period"]) {
        return queryInterface.removeColumn("user_index", "notice_period");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["gender"]) {
        return queryInterface.removeColumn("user_index", "gender");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["marital_status"]) {
        return queryInterface.removeColumn("user_index", "marital_status");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["nationality"]) {
        return queryInterface.removeColumn("user_index", "nationality");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["mode_of_recruitment"]) {
        return queryInterface.removeColumn("user_index", "mode_of_recruitment");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["week_days"]) {
        return queryInterface.removeColumn("user_index", "week_days");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["minimum_story_points"]) {
        return queryInterface.removeColumn("user_index", "minimum_story_points");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["minimum_productive_hours"]) {
        return queryInterface.removeColumn("user_index", "minimum_productive_hours");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["profile_status_id"]) {
        return queryInterface.removeColumn("user_index", "profile_status_id");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["evaluation_date"]) {
        return queryInterface.removeColumn("user_index", "evaluation_date");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["slack_name"]) {
        return queryInterface.removeColumn("user_index", "slack_name");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (
        tableDefinition &&
        tableDefinition["minimum_reported_tickets_story_points"]
      ) {
        return queryInterface.removeColumn(
          "user_index",
          "minimum_reported_tickets_story_points"
        );
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["minimum_reported_tickets"]) {
        return queryInterface.removeColumn("user_index", "minimum_reported_tickets");
      } else {
        return Promise.resolve(true);
      }
    });

    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["minimum_completed_tickets"]) {
        return queryInterface.removeColumn("user_index", "minimum_completed_tickets");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["manager"]) {
        return queryInterface.removeColumn("user_index", "manager");
      } else {
        return Promise.resolve(true);
      }
    });
    await queryInterface.describeTable("user_index").then((tableDefinition) => {
      if (tableDefinition && tableDefinition["tracker_user_id"]) {
        return queryInterface.removeColumn("user_index", "tracker_user_id");
      } else {
        return Promise.resolve(true);
      }
    });
  },
};
