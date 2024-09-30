const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const Number = require("../lib/Number");
const Request = require("../lib/request");
const history = require("./HistoryService");
const userService = require("./UserService");
const { PageBlock } = require("../db").models;



class PageBlockService {


    static async create(req, res, next) {
        try{

      
        let data = req.body;
        const companyId = Request.GetCompanyId(req);
        let title = data?.title?.trim()
        const isDataExist = await PageBlock.findOne({ where: { company_id: companyId,title: title }, attributes: ["sort_order"], order: [["updatedAt", "DESC"]] });

        if(isDataExist){
            return res.json(400,{message: "Record Already Exist"})
        }

        
        const mostRecentData = await PageBlock.findOne({ where: { company_id: companyId }, attributes: ["sort_order"], order: [["updatedAt", "DESC"]] });
        let sortOrderNumber;
        if (mostRecentData) {
            sortOrderNumber = mostRecentData?.sort_order + 1;
        } else {
            sortOrderNumber = 1;
        }


        let createData = {
            sort_order: sortOrderNumber,
            title: data?.title ? data?.title :null,
            company_id: companyId
        }
        await PageBlock.create(createData).then((response) => {
            res.json(200, { message: "Page Block Added" })
            res.on('finish', async () => {
                history.create(`Page Block Added`, req, ObjectName.PAGE_BLOCK, response?.id);
              });
        })
    }catch(err){
        console.log(err);
    }
    }

    static async search(companyId) {

        let where = {}
        where.company_id = companyId


        let pageBlockList = await PageBlock.findAll({ where: where, order: [["sort_order", "ASC"]] });
        let data = []
        if (pageBlockList && pageBlockList.length > 0) {
            for (let i = 0; i < pageBlockList.length; i++) {
                const { id, sort_order, title } = pageBlockList[i];
                data.push({
                    id,
                    sort_order,
                    title
                })
            }
        }

        return data


    }

    static async updateSortOrder(req, res) {
        const companyId = Request.GetCompanyId(req);
        try {
            const newOrder = req.body;
            for (let i = 0; i < newOrder.length; i++) {
                await PageBlock.update(
                    { order: i + 1 },
                    {
                        where: {
                            id: newOrder[i].id,
                            company_id: companyId,
                        },
                    }
                );
            }
            res.json(Response.OK, {
                message: "Page Block Order Updated.",
            });
            res.on('finish', async () => {
                history.create(`Page Block Order Updated.`, req, ObjectName.PAGE_BLOCK);
              });
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };

    static async update(req, res) {
        const companyId = Request.GetCompanyId(req);
        try {
            const data = req.body;
            let id = req?.params?.id;
            let isAlreadyExist = await PageBlock.findOne({
                where: {
                    id: id,
                    company_id: companyId
                }
            });

            if (!isAlreadyExist) {
                return res.json(400, { message: "Detail Not Found" })
            }

            let updateData = {
              title: data?.title ? data?.title :""
            }

            await PageBlock.update(updateData, {
                where: {
                    id: id,
                    company_id: companyId
                }
            }).then((response) => {
                 res.json(200, { message: "Page Block updated" })
                res.on('finish', async () => {
                    history.create(`Page Block Updated`, req, ObjectName.PAGE_BLOCK, id);
                  });
            })
        } catch (err) {
            console.log(err);
            res.json(Response.BAD_REQUEST, { message: err.message });
        }
    };

    static async del (req, res, next) {
        const id = req.params.id;
        try {
      
          const company_id = Request.GetCompanyId(req);
          let pageBlockDetail = await PageBlock.findOne({
            where: {
              id: id,
              company_id: company_id,
            },
          })

          if(!pageBlockDetail){
            res.json(400,{message:"Detail Not Found"})
          }

          pageBlockDetail.destroy()
          res.json(Response.OK, { message: "Page Block Deleted" });
          res.on('finish', async () => {
            history.create(`Page Block Deleted`, req, ObjectName.PAGE_BLOCK, pageBlockDetail?.id);
          });
        } catch (err) {
          console.log(err);
          return res.json(Response.BAD_REQUEST, { message: err.message });
        }
      };
 
      
}
module.exports = PageBlockService;