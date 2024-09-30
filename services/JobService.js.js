
const { Jobs } = require("../db").models;



class JobService {

    static async list(params, companyId) {

        let where = {}

        where.company_id = companyId

        if (params?.status) {
            where.status = params?.status
        }

        let jobList = await Jobs.findAll({ where: where, order:[["job_title","ASC"]] });

        let list=[]
        if (jobList && jobList.length > 0) {

            for (let i = 0; i < jobList.length; i++) {
                const { job_title, id, job_description  } = jobList[i];

                list.push({
                    job_title: job_title,
                    id: id,
                    job_description: job_description
                })
            }
        }

        return list;

    }
}

module.exports = JobService;