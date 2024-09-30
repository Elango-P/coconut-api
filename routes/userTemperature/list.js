// Utils
const utils = require("../../lib/utils");

// Models
const { UserTemperature } = require("../../db").models;

const DateTime = require("../../lib/dateTime");

const dateTime = new DateTime();

function list(req, res) {
  UserTemperature.findAll({
    attributes: [
      "id",
      "user_id",
      "date",
      "temperature",
      "image",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt"]],
  }).then((userTemperatures) => {
    const userTemperaturesList = [];
    userTemperatures.forEach((userTemperature) => {
      userTemperature = userTemperature.get();

      userTemperaturesList.push({
        userId: userTemperature.user_id,
        date: utils.formatLocalDate(
          userTemperature.date,
          dateTime.formats.frontendDateTime12HoursFormat
        ),
        temperature: userTemperature.temperature,
        mediaName: userTemperature.image,
        mediaUrl: `${userTemperature.user_id}/${userTemperature.temperature}`,
        mediaAttachmentUrl: utils.getUserTemperatureUrl(
          userTemperature.user_id,
          userTemperature.temperature
        ),
        createdAt: utils.formatLocalDate(
          userTemperature.createdAt,
          dateTime.formats.frontendDateTime12HoursFormat
        ),
        updatedAt: utils.formatLocalDate(
          userTemperature.updatedAt,
          dateTime.formats.frontendDateTime12HoursFormat
        ),
      });
    });

    res.json(userTemperaturesList);
  });
}

module.exports = list;
