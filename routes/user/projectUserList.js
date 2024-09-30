const { ProjectUser, User: userModel } = require('../../db').models;
const DataBaseService = require('../../lib/dataBaseService');
const ProjectUserModel = new DataBaseService(ProjectUser);
const Request = require('../../lib/request');
const { OK } = require('../../helpers/Response');
const User = require('../../helpers/User');
async function projectUserList(req, res, next) {
  try {
    let { projectId ,status } = req.query;
    const companyId = Request.GetCompanyId(req);


    if (!companyId) {
      return res.json(404, { message: 'Company Id Not Found' });
    }
    const where = {};

    if(status){
      where.status = status
    }
    where.company_id = companyId;
    if (projectId) {
      where.project_id = projectId;
    }
    const query = {
      order: [[{ model: userModel, as: 'user' }, 'name', 'ASC']],
      include: [
        {
          required: true,
          model: userModel,
          as: 'user',
          where:{
            status: User.STATUS_ACTIVE
          }
        },
      ],
      where,
    };

    const ProjectUserDetail = await ProjectUserModel.findAndCount(query);
    let list = [];

    for (let i in ProjectUserDetail.rows) {
      let { user } = ProjectUserDetail.rows[i];

      let userList = {
        id: user?.id,
        first_name: user?.name,
        last_name: user?.last_name,
        media_url:user?.media_url
      };
      list.push(userList);
    }

    res.send(OK, {
      data: list,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = projectUserList;
