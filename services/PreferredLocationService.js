const ObjectName = require("../helpers/ObjectName");
const Response = require("../helpers/Response");
const Number = require("../lib/Number");
const Request = require("../lib/request");
const history = require("./HistoryService");
const userService = require("./UserService");
const { PreferredLocation, User, Shift, Location } = require("../db").models;



class PreferredLocationService {


    static async create(req, res, next) {
        let data = req.body;
        const companyId = Request.GetCompanyId(req);

        const isDataExist = await PreferredLocation.findOne({ where: { company_id: companyId,user_id: data.user,shift_id: data.shift, location_id: data.location }, attributes: ["preferred_order"], order: [["updatedAt", "DESC"]] });

        if(isDataExist){
            return res.json(400,{message: "Record Already Exist"})
        }
        
        const mostRecentData = await PreferredLocation.findOne({ where: { company_id: companyId,user_id: data?.user }, attributes: ["preferred_order"], order: [["updatedAt", "DESC"]] });
        let preferredOrderNumber;
        if (mostRecentData) {
            preferredOrderNumber = mostRecentData?.preferred_order + 1;
        } else {
            preferredOrderNumber = 1;
        }


        let createData = {
            preferred_order: preferredOrderNumber,
            user_id: Number.isNotNull(data.user) ? data.user : null,
            shift_id: Number.isNotNull(data.shift) ? data.shift : null,
            location_id: Number.isNotNull(data.location) ? data.location : null,
            company_id: companyId
        }
        await PreferredLocation.create(createData).then((response) => {
            res.json(200, { message: "Preferred Location Added" })
            res.on('finish', async () => {
                history.create(`Preferred Location Created`, req, ObjectName.USER, data?.user);
                if(Number.isNotNull(data.user)){
                    await userService.reindex(data.user,companyId)
                }
              });
        })
    }

    static async search(req, res, next) {

        let params = req.query;
        let companyId = Request.GetCompanyId(req);
        let where = {}
        where.company_id = companyId

        if (Number.isNotNull(params.user)) {
            where.user_id = params.user
        }

        let include = [
            {
                required: false,
                model: User,
                as: "userDetail",
            },
            {
                required: false,
                model: Shift,
                as: "shiftDetail",
            },
            {
                required: false,
                model: Location,
                as: "locationDetail",
            }
        ]

        let preferredlocationList = await PreferredLocation.findAll({ where: where, include: include, order: [["preferred_order", "ASC"]] });
        let data = []
        if (preferredlocationList && preferredlocationList.length > 0) {
            for (let i = 0; i < preferredlocationList.length; i++) {
                const { userDetail, shiftDetail, locationDetail, user_id, shift_id, location_id, id, preferred_order } = preferredlocationList[i];
                data.push({
                    id,
                    preferred_order,

                    userFirstName: userDetail?.name,
                    userLastName: userDetail?.last_name,
                    userMediaUrl: userDetail?.media_url,
                    user_id,

                    shiftName: shiftDetail?.name,
                    shift_id: shift_id,

                    locationName: locationDetail?.name,
                    location_id: location_id
                })
            }
        }

        res.json(200, { data: data })

    }

    static async updateSortOrder(req, res) {
        const companyId = Request.GetCompanyId(req);
        try {
            const newOrder = req.body;
            for (let i = 0; i < newOrder.length; i++) {
                await PreferredLocation.update(
                    { preferred_order: i + 1 },
                    {
                        where: {
                            id: newOrder[i].id,
                            company_id: companyId,
                        },
                    }
                );
            }
            res.json(Response.OK, {
                message: "Preferred Location order updated.",
            });
            res.on('finish', async () => {
                history.create(`Preferred Location order updated`, req, ObjectName.USER, newOrder[0]?.user_id);
                if(newOrder.length > 0){
                    await userService.reindex(newOrder[0]?.user_id,companyId)
                }
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
            let isAlreadyExist = await PreferredLocation.findOne({
                where: {
                    id: id,
                    company_id: companyId
                }
            });

            if (!isAlreadyExist) {
                return res.json(400, { message: "Detail Not Found" })
            }

            let updateData = {
                user_id: Number.isNotNull(data.user) ? data.user : null,
                shift_id: Number.isNotNull(data.shift) ? data.shift : null,
                location_id: Number.isNotNull(data.location) ? data.location : null,
            }

            await PreferredLocation.update(updateData, {
                where: {
                    id: id,
                    company_id: companyId
                }
            }).then((response) => {
                 res.json(200, { message: "Preferred Location updated" })
                res.on('finish', async () => {
                    history.create(`Preferred Location Updated`, req, ObjectName.USER, data?.user);
                    if(Number.isNotNull(data.user)){
                        await userService.reindex(data.user,companyId)
                    }
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
          let preferredLocationDetail = await PreferredLocation.findOne({
            where: {
              id: id,
              company_id: company_id,
            },
          })

          if(!preferredLocationDetail){
            res.json(400,{message:"Detail Not Found"})
          }

          preferredLocationDetail.destroy()
          res.json(Response.OK, { message: "Preferred Location Deleted" });
          res.on('finish', async () => {
            history.create(`Preferred Location Deleted`, req, ObjectName.USER, preferredLocationDetail?.user_id);
            if(Number.isNotNull(preferredLocationDetail?.user_id)){
                await userService.reindex(preferredLocationDetail?.user_id,company_id)
            }
          });
        } catch (err) {
          console.log(err);
          return res.json(Response.BAD_REQUEST, { message: err.message });
        }
      };


      static async getFirstRecord(companyId,userId){
        let where ={}
        where.company_id = companyId

        if(userId){
          where.user_id = userId
        }

        let getDetail = await PreferredLocation.findOne({
            where: where,
            order:[["preferred_order","ASC"]]
        });

        return getDetail;
      }
      
}
module.exports = PreferredLocationService;