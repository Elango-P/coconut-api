const { DriveFileCategory } = require("../../db").models;

function list(req, res) {
  DriveFileCategory.findAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]],
  }).then((results) => {
    const categories = [];
    results.forEach((documentCategory) => {
      categories.push({
        id: documentCategory.id,
        name: documentCategory.name,
      });
    });

    res.json(categories);
  }).catch((err)=>{
    console.log(err);
  })
}

module.exports = list;
