
const { TransferType, Location } = require("../db").models;

const Request = require("../lib/request");
const History = require("./HistoryService");
const ObjectName = require("../helpers/ObjectName");
const DataBaseService = require("../lib/dataBaseService");
const { userRoleService } = require('./UserRoleService');
const TransferTypeStatus = require("../helpers/TransferType");


/**
 * Module dependencies
 */
const { BAD_REQUEST, UPDATE_SUCCESS } = require("../helpers/Response");

//Utils
const { defaultDateFormat } = require("../lib/utils");
const { Op } = require("sequelize");

const TransferTypeHelper = require("../helpers/TransferType");
const Status = require("../helpers/Status");

const TransferTypeServiceModal = new DataBaseService(TransferType);

class TransferTypeService {
    static async create(req, res) {
        try {
            const data = req.body;
            let companyId = Request.GetCompanyId(req);
            //Validation
            const isNameExists =
                await TransferTypeServiceModal.findOne({
                    where: { name: data.name, company_id: companyId },
                });

            if (isNameExists) {
                return res.send(400, { message: "transfer type already exist" });
            }
            const role = []
            if (data.allowedUser) {
                JSON.parse(data.allowedUser).forEach((data) => {
                    role.push(data.value);
                });
            }

            const allowedStatuses = []
            if (data.allowedStatus) {
                JSON.parse(data.allowedStatus).forEach((data) => {
                    allowedStatuses.push(data.value);
                });
            }

            //update TransferType details
            const TransferTypeDetails = {
                name: data.name,
                group : data.group || null,
                allowed_role_id: role.join(",") || null,
                status: data && data?.status ? data?.status?.value : data,
                default_to_store: data?.default_to_store ? data?.default_to_store?.value : null,
                default_from_store: data?.default_from_store ? data?.default_from_store?.value : null,
                allow_to_change_from_store: data?.allow_to_change_from_store ? data?.allow_to_change_from_store : null,
                allow_to_change_to_store: data?.allow_to_change_to_store ? data?.allow_to_change_to_store : null,
                offline_mode: data.offline_mode ? data.offline_mode : null,
                allowed_statuses: allowedStatuses.join(",") || null,
                company_id: companyId,
                allow_replenishment: data.allow_replenishment ? TransferTypeHelper.ALLOW_REPLENISHMENT : TransferTypeHelper.DENY_REPLENISHMENT

            };

            const transferType = await TransferTypeServiceModal.create(TransferTypeDetails)

            res.send(201, {
                message: "Transfer Type Created",
            });
            res.on(("finish"), async () => {
                History.create("Transfer Type Created", req, ObjectName.TRANSFER_TYPE, transferType.id);
            })
        } catch (err) {
            console.log(err);
        }
    }

    static async search(req, res) {
        try {
            let { page, pageSize, search, sort, sortDir, pagination, allowed_role_id } = req.query;

            // Validate if page is not a number
            page = page ? parseInt(page, 10) : 1;
            if (isNaN(page)) {
                return res.send(400, { message: "Invalid page" });
            }
            const company_id = Request.GetCompanyId(req);
            // Validate if page size is not a number
            pageSize = pageSize ? parseInt(pageSize, 10) : 25;
            if (isNaN(pageSize)) {
                return res.send(400, { message: "Invalid page size" });
            }

            const validOrder = ["ASC", "DESC"];
            const sortableFields = {
                name: "name",
                status: "status",
                default_from_store: "default_to_store",
                default_to_store: "default_to_store",
                createdAt: "createdAt",
                updatedAt: "updatedAt",
                id: "id",
            };

            const sortParam = sort || "name";
            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
                return res.send(400, { message: `Unable to sort tag by ${sortParam}` });
            }

            const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
                return res.json(400, { message: "Invalid sort order" });
            }

            const where = {};

            where.company_id = company_id;

            const status = req.query.status;

            if (status) {
                where.status = status;
            }

            // Search by term
            const searchTerm = search ? search.trim() : null;
            if (searchTerm) {
                where[Op.or] = [
                    {
                        "$location.name$": {
                            [Op.iLike]: `%${searchTerm}%`,
                        },
                    },
                    {
                        "$to_location.name$": {

                            [Op.iLike]: `%${searchTerm}%`
                        }
                    },
                    {
                        name: {
                            [Op.iLike]: `%${searchTerm}%`,
                        },
                    },
                ];
            }

            const query = {
                include: [
                    {
                        required: false,
                        model: Location,
                        as: "location",
                        attributes: ["name", "id"]
                    },
                    {
                        required: false,
                        model: Location,
                        as: "to_location",
                        attributes: ["id", "name"],
                    },
                ],
                order: sortParam !== ("location" || "to_location") ? [[sortableFields[sortParam], sortDirParam]] : [[{ model: Location, as: 'location' || 'to_location' }, 'name', sortDirParam]],
                where,
                attributes: { exclude: ["deletedAt"] },
            };

            if (pagination) {
                if (pageSize > 0) {
                    query.limit = pageSize;
                    query.offset = (page - 1) * pageSize;
                }
            }

            // Get list and count
            const results = await TransferTypeServiceModal.findAndCount(query);

            const data = [];

            if (results.count === 0) {
              return res.send(200, data);
          }

            for (const transferTypeData of results.rows) {
                const roleValue = [];

                if (transferTypeData.allowed_role_id) {
                    const roleIds = transferTypeData.allowed_role_id.split(`,`);

                    for (const roleId of roleIds) {
                        try {
                            const roleName = await userRoleService.findOne({ where: { id: roleId } });
                            const data = roleName && roleName.get();
                            if (data) {
                                roleValue.push({
                                    id: data.id,
                                    name: data.role_name
                                });
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }

                data.push({
                    id: transferTypeData.id,
                    name: transferTypeData.name,
                    status: transferTypeData.status,
                    group : transferTypeData.group,
                    default_from_store_id: transferTypeData.default_from_store,
                    default_to_store_id: transferTypeData.default_to_store,
                    default_from_store: transferTypeData?.location?.name,
                    allow_to_change_from_store: transferTypeData?.allow_to_change_from_store == 1 ? true : false,
                    allow_to_change_to_store: transferTypeData?.allow_to_change_to_store == 1 ? true : false,
                    offline_mode: transferTypeData?.offline_mode == 1 ? true : false,
                    allowed_role_id: roleValue,
                    allowedStatuses: transferTypeData?.allowed_statuses && transferTypeData?.allowed_statuses.split(","),
                    default_to_store: transferTypeData.to_location?.name,
                    allow_replenishment: transferTypeData.allow_replenishment == TransferTypeHelper.ALLOW_REPLENISHMENT ? true : false,
                    createdAt: defaultDateFormat(transferTypeData.createdAt),
                    updatedAt: defaultDateFormat(transferTypeData.updatedAt),
                });
            }

            res.send({
                totalCount: results.count,
                currentPage: page,
                pageSize,
                data: data,
            });

        } catch (err) {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        }
    }

    static async list(req, res) {
        try {
            const company_id = Request.GetCompanyId(req);
            if (!company_id) {
                return res.json(400, { message: 'Company Not Found' });
              }
            const where = {};

            where.company_id = company_id;


                where.status = Status.ACTIVE;         
             
                const query = {
                    order: [['name', 'ASC']],
                    where,
                  };

            // Get list and count
            const results = await TransferTypeServiceModal.findAndCount(query);

            if (results.count === 0) {
                return res.send(200, null);
            }

            const data = [];

            for (const transferTypeData of results.rows) {

                data.push({
                    id: transferTypeData.id,
                    name: transferTypeData.name,
                });
            }

            res.send({
                totalCount: results.count,
                data: data,
            });

        } catch (err) {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        }
    }

    static async update(req, res, next) {
        const { id } = req.params;

        try {
            const data = req.body;
            const name = data.name;


            const isTransferTypeExist = await TransferType.findOne({
                where: { id },
            });
            const role = []
            if (data.allowedUser) {
                JSON.parse(data.allowedUser).forEach((data) => {
                    role.push(data.value);
                });
            }
            const allowedStatuses = []
            if (data.allowedStatus) {
                JSON.parse(data.allowedStatus).forEach((data) => {
                    allowedStatuses.push(data.value);
                });
            }

            //update TransferType details
            const TransferTypeDetails = {
                name: name,
                group : data.group|| null,
                allowed_role_id: role.join(",") || null,
                status: data && data.status ? data.status.value : data,
                default_to_store: data.default_to_store ? data.default_to_store.value : null,
                default_from_store: data.default_from_store ? data.default_from_store.value : null,
                allow_to_change_from_store: data.allow_to_change_from_store ? data.allow_to_change_from_store : null,
                allow_to_change_to_store: data.allow_to_change_to_store ? data.allow_to_change_to_store : null,
                offline_mode: data.offline_mode ? data.offline_mode : null,
                allowed_statuses: allowedStatuses.join(",") || null,
                allow_replenishment: data.allow_replenishment ? TransferTypeHelper.ALLOW_REPLENISHMENT : TransferTypeHelper.DENY_REPLENISHMENT
            };

            const save = await isTransferTypeExist.update(TransferTypeDetails);

            // API response
            res.json(UPDATE_SUCCESS, { message: "TransferType Updated", data: save.get(), })

            // History On Finish Function
            res.on(("finish"), async () => {
                History.create("TransferType Updated", req, ObjectName.TRANSFER_TYPE, id);
            })

        } catch (err) {
            console.log(err);
            //create a log
            res.json(BAD_REQUEST, { message: err.message, })
        }
    }

    static async searchByRole(req, res, next) {
        try {
            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            const roleId = Request.getUserRole(req);

            let transferrTypeLists = new Array();

            if (roleId) {
                let transferTypeList = await TransferTypeServiceModal.find({
                    where: { company_id: companyId, status: TransferTypeStatus.ENABLE },
                    order: [['name', 'ASC']],
                    include: [
                        {
                            required: false,
                            model: Location,
                            as: "location",
                            attributes: ["name", "id"]
                        },
                        {
                            required: false,
                            model: Location,
                            as: "to_location",
                            attributes: ["id", "name"],
                        },
                    ],
                })

                if (transferTypeList && transferTypeList.length > 0) {

                    for (let i = 0; i < transferTypeList.length; i++) {

                        const { id, name, status, default_from_store, default_to_store, allow_to_change_from_store, allow_to_change_to_store, offline_mode, allowed_role_id, location, to_location } = transferTypeList[i];

                        if (allowed_role_id) {

                            let roleIds = allowed_role_id.split(",");

                            if (roleIds && roleIds.length > 0) {

                                roleIds = roleIds.map((data) => {
                                    return parseInt(data)
                                });
                                if (roleIds.indexOf(roleId) > -1) {

                                    transferrTypeLists.push({
                                        id,
                                        name,
                                        status,
                                        default_from_store,
                                        default_to_store,
                                        allow_to_change_from_store,
                                        allow_to_change_to_store,
                                        offline_mode,
                                        default_to_store,
                                        default_from_store_name: location ? location.name : "",
                                        default_to_store_name: to_location ? to_location.name : ""
                                    })
                                }
                            }
                        }
                    }
                }

            }

            res.send({ data: transferrTypeLists });


        } catch (err) {
            console.log(err);
        }
    }


    static async get(req, res) {
        try {
            const { id } = req.params;

            const company_id = Request.GetCompanyId(req);

            if (!id) {
                return res.json(400, { message: "Invalid Id" });
            }

            const TransferTypeData = await TransferType.findOne({
                where: {
                    id: id,
                    company_id: company_id,
                },
            });
            let roleValue = []
            if (TransferTypeData.allowed_role_id) {
                let role = TransferTypeData.allowed_role_id.split(`,`)
                if (role) {
                    try {
                        for (let i = 0; i < role.length; i++) {
                            let roleName = await userRoleService.findOne({ where: { id: role[i] } })
                            const data = roleName.get()
                            roleValue.push({
                                id: data.id,
                                name: data.role_name
                            });
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }


            if (!TransferTypeData) return res.json(200, { message: "No Records Found" });

            let { name, status,group, default_from_store, default_to_store, allow_to_change_from_store, allow_to_change_to_store, offline_mode, allowed_statuses, allow_replenishment } = TransferTypeData.get();

            let data = {
                name,
                status,
                group,
                default_from_store,
                default_to_store,
                allow_to_change_from_store: allow_to_change_from_store == 1 ? true : false,
                allow_to_change_to_store: allow_to_change_to_store == 1 ? true : false,
                offline_mode: offline_mode == 1 ? true : false,
                allowedUser: roleValue,
                allowed_statuses: allowed_statuses && allowed_statuses?.split(","),
                allow_replenishment: allow_replenishment == TransferTypeHelper.ALLOW_REPLENISHMENT ? true : false
            };

            res.json(200, data);

        } catch (err) {
            console.log(err);
        }

    }
    static async getTransferTypeByGroup (groupId, companyId) {
        try {
    
            let where = new Object();
    
            where.company_id = companyId;
    
    
            where.group = groupId;
    
            const transferTypeDetails = await TransferType.findOne({ where: where });
    
            return transferTypeDetails;
        } catch (err) {
            console.log(err);
        }
    }

    static async delete(req, res, next) {
        let id = req.params.id;

        try {
            //get company Id from request
            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            //validate Order Id exist or not
            if (!id) {
                return res.json(400, { message: "TransferType Not Found" });
            }

            //delete Order
            await TransferType.destroy({ where: { id: id, company_id: companyId } });

            res.json(200, { message: "TransferType Deleted" });

            // History On Finish Function
            res.on(("finish"), async () => {
                History.create("TransferType Deleted", req, ObjectName.TRANSFER_TYPE, id);
            })
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = TransferTypeService;