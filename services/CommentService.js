const ObjectName = require('../helpers/ObjectName');
const Request = require('../lib/request');
const History = require('./HistoryService');
const { BAD_REQUEST, UPDATE_SUCCESS, OK } = require('../helpers/Response');
const Url = require("../lib/Url");

// Model
const {  User, Comment  } = require('../db').models;
const { Op } = require('sequelize');
const validator = require("../lib/validator");
const { getUserDetailById } = require("./UserService");
const { concatName } = require("../lib/string");
const sendCommentNotification = require("./notifications/comment");
const ArrayList = require("../lib/ArrayList");

class CommentService {

    static async create(req, res) {
        let data = req.body;
        if (!data.message) {
            return res.json(400, { message: "Comment Is Required" })
        }
        try {
            //get company Id from request
            const company_id = Request.GetCompanyId(req);

            // Getting the Reporter id from logged in user.
            let userId = Request.getUserId(req);
            let { id } = req.params

            let commentCreateData = {
                updated_by: userId,
                comment: data?.message && validator.isValidDraftFormat(Url.RawURLDecode(data?.message)) ? Url.RawURLDecode(data?.message) : validator.convertTextToDraftFormat(data?.message),
                object_id: id ? parseInt(id) : data?.id,
                object_name: data?.objectName,
                company_id: company_id,
            };
            if (data && data?.user && data?.user.length > 0) {
                commentCreateData.user_ids = data?.user?.join(",");
            }


            let commentDetails = await Comment.create(commentCreateData);
            res.json(200, {
                message: "Comment Added",
                commentDetails: commentDetails,
            });
            res.on("finish", () => {
                this.createAuditLog(data, req, id);
                sendCommentNotification(data?.user, req, data?.message, parseInt(id), { objectName: data?.objectName })
            });
        } catch (err) {
            console.log(err);
            return res.json(400, { message: err.message });
        }
    };

    static async search(req, res, next) {

        const companyId = Request.GetCompanyId(req);
        const userId = Request.getUserId(req);

        let { page, pageSize, search, sort, sortDir, pagination, objectId, objectName } = req.query;

        // Validate objectId and objectName
        if (!objectId) {
            return res.json(BAD_REQUEST, { message: "ObjectId is Required" });
        }

        if (!objectName) {
            return res.json(BAD_REQUEST, { message: "ObjectName is Required" });
        }

        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
            return res.json(BAD_REQUEST, { message: "Invalid page" });
        }
        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
            return res.json(BAD_REQUEST, { message: "Invalid page size" });
        }

        if (!companyId) {
            return res.json(400, { message: "Company Not Found" });
        }
        // Sortable Fields
        const validOrder = ["ASC", "DESC"];
        const sortableFields = {
            comment: "comment",
            created_at: "created_at",
            updated_at: "updated_at",
        };

        const sortParam = sort || "updated_at";
        // Validate sortable fields is present in sort param
        if (!Object.keys(sortableFields).includes(sortParam)) {
            return res.json(BAD_REQUEST, {
                message: `Unable to sort message by ${sortParam}`,
            });
        }
        const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
        // Validate order is present in sortDir param
        if (!validOrder.includes(sortDirParam)) {
            return res.json(BAD_REQUEST, { message: "Invalid sort order" });
        }
        const where = { company_id: companyId, object_id: objectId, object_name: objectName };

        // Search term
        const searchTerm = search ? search.trim() : null;
        if (searchTerm) {
            where[Op.or] = [
                {
                    comment: {
                        [Op.iLike]: `%${searchTerm}%`,
                    },
                },
            ];
        }
        const query = {
            include: [
                {
                    required: true,
                    model: User,
                    as: 'updatedBy',
                },
            ],
            order: [[sortableFields[sortParam], sortDirParam]],
            where,
        };

        if (pagination) {
            if (pageSize > 0) {
                query.limit = pageSize;
                query.offset = (page - 1) * pageSize;
            }
        }
        try {
            // Get message list and count
            const commentDetails = await Comment.findAndCountAll(query);

            // Return message is null
            if (commentDetails.count === 0) {
                return res.json({});
            }
            const data = [];

            for (let index = 0; index < commentDetails.rows.length; index++) {
                const comments = commentDetails.rows[index];

                const { id, comment, updatedBy, updated_at, updated_by, user_ids } = comments.get();
                let users = [];
                let userIds = ArrayList.StringIntoArray(user_ids);
                if (userIds && userIds.length > 0) {
                    for (let i = 0; i < userIds.length; i++) {
                        const id = userIds[i];

                        let getUsers = await getUserDetailById(id, companyId);

                        users.push({
                            first_name: getUsers?.name,
                            last_name: getUsers?.last_name,
                            media_url: getUsers?.media_url,
                            id: getUsers?.id,
                        });
                    }
                }

                data.push({
                    id: id,
                    message: comment && validator.isValidDraftFormat(Url.RawURLDecode(comment)) ? validator.convertDraftFormatToText(JSON.parse(Url.RawURLDecode(comment))) : comment,
                    comment: comment && validator.isValidDraftFormat(Url.RawURLDecode(comment)) ? Url.RawURLDecode(comment) : validator.convertTextToDraftFormat(comment),
                    first_name: updatedBy.name,
                    last_name: updatedBy.last_name,
                    timestamp: updated_at,
                    userId: updated_by,
                    media_url: updatedBy.media_url,
                    users: users
                });
            }

            res.json(OK, {
                totalCount: commentDetails.count,
                currentPage: page,
                pageSize,
                data,
                loggedInUserId: userId,
                search,
            });
        } catch (err) {
            console.log(err);
            res.json(BAD_REQUEST, { message: err.message });
        }
    }

    static async update(req, res, next) {
        const company_id = Request.GetCompanyId(req);

        const data = req.body;
        const { id } = req.params;
        let userId = req.user.id;
        if (!id) {
            return res.json(BAD_REQUEST, { message: "Comment id is required" });
        }

        const commentDetails = await Comment.findOne({
            where: { id: id, company_id: company_id, updated_by: userId },
        });

        if (!commentDetails) {
            return res.json(BAD_REQUEST, { message: "Invalid Comment id" });
        }
        data.objectName = commentDetails?.object_name
        // Update comment details
        const updateMessage = {
            comment: data.message ? Url.RawURLDecode(data.message) : "",
        };
        try {
            const save = await Comment.update(updateMessage, {
                where: { id: id, company_id: company_id, updated_by: userId },
            });
            // API response
            res.json(UPDATE_SUCCESS, {
                message: "Comment Updated",
                data: save,
            });
            res.on("finish", async () => {
                this.createAuditLog(data, req, commentDetails?.object_id);
            });
        } catch (err) {
            conxxsole.log(err);
            res.json(BAD_REQUEST, { message: err.message });
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            let data = JSON.parse(req.params.data);

            const company_id = Request.GetCompanyId(req);
            // Validate tag id
            if (!id) {
                return res.json(BAD_REQUEST, { message: 'Object id is required' });
            }

            if (!data?.commentId) {
                return res.json(BAD_REQUEST, { message: 'Comment id is required' });
            }
            const userId = req.user.id;
            // Validate tag is exist or not
            const commentDetails = await Comment.findOne({
                where: { id: data?.commentId, object_id: id, company_id: company_id, updated_by: userId },
            });

            if (!commentDetails) {
                return res.json(BAD_REQUEST, { message: ' Comment not found' });
            }

            // Delete tag
            await commentDetails.destroy();
            res.on('finish', async () => {
                History.create(`Comment Deleted`, req, data?.objectName, id);
            });

            res.json(200, { message: 'Comment Deleted' });
        } catch (err) {
            console.log(err);
        }
    }

    static async createAuditLog(createData, req, id) {
        let companyId = Request.GetCompanyId(req);
        let userId = Request.getUserId(req);
        const user = await getUserDetailById(userId, companyId);
        let auditLogMessage = new Array();

        if (userId) {
            auditLogMessage.push(`Updated By: ${concatName(user?.name, user?.last_name)}\n`);
        }

        if (typeof createData?.message === 'string') {
            auditLogMessage.push(`Comment: ${createData?.message}\n`);
        }
        else if (createData?.message) {
            const commentDecoded = Url.RawURLDecode(createData?.message);
            const commentData = JSON.parse(commentDecoded);
            if (commentData?.blocks && commentData?.blocks.length > 0) {
                for (let i = 0; i < commentData?.blocks.length; i++) {
                    const { text } = commentData?.blocks[i];
                    auditLogMessage.push(i == 0 ? `Comment: ${text}\n` : text)
                }
            }
        }

        if (auditLogMessage && auditLogMessage.length > 0) {
            let message = auditLogMessage.join();
            History.create(message, req, createData?.objectName, id);
        } else {
            History.create("Comment Added", req, createData?.objectName, id);
        }
    }

}
module.exports = CommentService;