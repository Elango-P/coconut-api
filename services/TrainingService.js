const Response = require("../helpers/Response");
const { BAD_REQUEST } = require("../helpers/Response");
const Request = require("../lib/request");
const History = require("./HistoryService");
const { Training, Media: MediaModal } = require('../db').models;
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");
const { getMediaURL } = require("./MediaService");
const ObjectName = require("../helpers/ObjectName");
const { Op } = require("sequelize");
const MediaServices = require("./media");
const { Media } = require("../helpers/Media");


class TrainingService {

    static async create(req, res, next) {

        try{

        let { training_name } = req.body;
        const companyId = Request.GetCompanyId(req);

        if (!companyId) {
            res.json(BAD_REQUEST, { message: "Company Id Required" });
        }

        const name = training_name.trim();
        const trainingExits = await Training.findOne({
            where: { training_name: name, company_id: companyId },
        });
        if (trainingExits) {
            return res.json(BAD_REQUEST, { message: "Training Name already exist" });
        }

        let data = {
            training_name: training_name,
            company_id: companyId
        }

        let TrainingDetail = await Training.create(data);

        res.on("finish", async () => {
            History.create("Training Added", req);
        });

        res.json(Response.OK, {
            message: "Training Added",
            data: TrainingDetail,
        });
    } catch (err){
        console.log(err);
    }

    }

    static async search(req, res, next) {
        try {
            //get req params
            let params = req.query;

            //destructure the params
            let { page, pageSize, search, sort, sortDir, pagination } = params;
            let where = new Object();

            //get company Id from request
            const companyId = Request.GetCompanyId(req);

            // Validate if page is not a number
            page = page ? parseInt(page, 10) : 1;
            if (isNaN(page)) {
                throw { message: "Invalid page" };
            }

            // Validate if page size is not a number
            pageSize = pageSize ? parseInt(pageSize, 10) : 25;
            if (isNaN(pageSize)) {
                throw { message: "Invalid page size" };
            }

            // Sortable Fields
            const validOrder = ["ASC", "DESC"];
            const sortableFields = {
                training_name: "training_name",

            };

            const sortParam = sort || "training_name";
            // Validate sortable fields is present in sort param
            if (!Object.keys(sortableFields).includes(sortParam)) {
                return res.json(BAD_REQUEST, {
                    message: `Unable to sort product by ${sortParam}`,
                });
            }

            const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
            // Validate order is present in sortDir param
            if (!validOrder.includes(sortDirParam)) {
                return res.json(BAD_REQUEST, {
                    message: "Invalid sort order",
                });
            }

            const searchTerm = search ? search.trim() : null;
            if (searchTerm) {
                where[Op.or] = [
                    {
                        training_name: {
                            [Op.iLike]: `%${searchTerm}%`,
                        },
                    },
                ];
            }

            //append the company id
            where.company_id = companyId;

            //create query object
            const query = {
                order: [["training_name", "ASC"]],
                where,
            };

            if (validator.isEmpty(pagination)) {
                pagination = true;
            }
            if (Boolean.isTrue(pagination)) {
                if (pageSize > 0) {
                    query.limit = pageSize;
                    query.offset = (page - 1) * pageSize;
                }
            }



            const trainingDetails = await Training.findAndCountAll(query);
            let list = []
            for (let i in trainingDetails && trainingDetails.rows) {
                let { id, user_id, training_name, banner_image, course_file } = trainingDetails.rows[i];

                let data = {
                    id: id,
                    user_id: user_id,
                    training_name,
                    banner_image: await getMediaURL(banner_image, companyId),
                    course_file: await getMediaURL(course_file, companyId)
                }
                list.push(data)
            }


            //return response
            return res.json(200, {
                totalCount: trainingDetails.count,
                currentPage: page,
                pageSize,
                data: list,
                sort,
                sortDir,
            });
        } catch (err) {
            console.log(err);
            return res.json(400, {
                message: err.message,
            });
        }
    };


    static async get(req, res, next) {
        try {

        const { id } = req.params;

        let companyId = Request.GetCompanyId(req);

        if (!id) {
            return res.json(BAD_REQUEST, { message: "Training id required" });
        }
        if (!companyId) {
            return res.json(BAD_REQUEST, { message: "CompanyId required" });
        }

        let getTrainingDetail = await Training.findOne({
            where: {
                company_id: companyId,
                id: id
            }
        });

        let data = {
            id: getTrainingDetail?.id,
            user_id: getTrainingDetail?.user_id,
            training_name: getTrainingDetail?.training_name,
            category: getTrainingDetail?.category,
            description: getTrainingDetail?.description,
            status: getTrainingDetail?.status,
            banner_image: await getMediaURL(getTrainingDetail?.banner_image, companyId),
            course_file: await getMediaURL(getTrainingDetail?.course_file, companyId),
            company_id: getTrainingDetail?.company_id,
        }
        res.json({ data: data })
    } catch (err){
        console.log(err);
    }
    }

    static async update(req, res, next) {


        try {
            const { id } = req.params;
            const data = req.body;
            let imageDetail = req && req.files && req.files.banner_image;
            let fileDetail = req && req.files && req.files.course_file;
            let companyId = Request.GetCompanyId(req);
            if (!data?.id) {
                return res.json(BAD_REQUEST, { message: "Training id required" });
            }
            if (!companyId) {
                return res.json(BAD_REQUEST, { message: "CompanyId required" });
            }

            let updateData = {
                training_name: data?.training_name ? data?.training_name : "",
                description: data?.description ? data?.description : "",
                category: data?.category ? data?.category : "",
            }

            if (data?.banner_image === "") {
                await MediaModal.destroy({
                    where: { object_id: id, company_id: companyId, object_name: ObjectName.TRAINING }
                })
                updateData.banner_image = null
            }

            if (data?.course_file === "") {
                await MediaModal.destroy({
                    where: { object_id: id, company_id: companyId, object_name: ObjectName.TRAINING }
                })
                updateData.course_file = null
            }


            if (imageDetail && imageDetail !== undefined) {

                let mediaDetail = await MediaModal.findOne({
                    where: { object_id: id, company_id: companyId, object_name: ObjectName.TRAINING }
                });

                if (!mediaDetail) {

                    let imageData = {
                        file_name: imageDetail?.name.trim(),
                        name: imageDetail?.name.trim(),
                        company_id: companyId,
                        object_id: id,
                        object_name: ObjectName.TRAINING,
                        visibility: Media.VISIBILITY_PUBLIC
                    }
                    let mediaDetails = await MediaModal.create(imageData);
                    if (mediaDetails) {
                        await MediaServices.uploadMedia(
                            imageDetail?.path,
                            mediaDetails?.id,
                            imageDetail?.name,
                            mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
                            true,
                        ).then(async () => {
                            updateData.banner_image = mediaDetails && mediaDetails?.id
                        })
                    }
                }

                if (mediaDetail) {

                    await MediaServices.uploadMedia(
                        imageDetail?.path,
                        mediaDetail?.id,
                        imageDetail?.name,
                        mediaDetail.visibility == Media.VISIBILITY_PUBLIC ? true : false,
                        true
                    ).then(async () => {
                        updateData.banner_image = mediaDetail && mediaDetail?.id
                    })
                }


            }

            if (fileDetail && fileDetail !== undefined) {
                let mediaDetail = await MediaModal.findOne({
                    where: { object_id: id, company_id: companyId, object_name: ObjectName.TRAINING }
                });

                if (!mediaDetail) {
                    let imageData = {
                        file_name: fileDetail?.name.trim(),
                        name: fileDetail?.name.trim(),
                        company_id: companyId,
                        object_id: id,
                        object_name: ObjectName.TRAINING,
                        visibility: Media.VISIBILITY_PUBLIC

                    }
                    let mediaDetails = await MediaModal.create(imageData);
                    if (mediaDetails) {
                        await MediaServices.uploadMedia(
                            fileDetail?.path,
                            mediaDetails?.id,
                            fileDetail?.name,
                            mediaDetails.visibility == Media.VISIBILITY_PUBLIC ? true : false,
                            true,
                        ).then(async () => {
                            updateData.course_file = mediaDetails && mediaDetails?.id;
                        })
                    }
                }
                if (mediaDetail) {
                    await MediaServices.uploadMedia(
                        fileDetail?.path,
                        mediaDetail?.id,
                        fileDetail?.name,
                        mediaDetail.visibility == Media.VISIBILITY_PUBLIC ? true : false,
                        true
                    ).then(async () => {
                        updateData.course_file = mediaDetail && mediaDetail?.id;
                    })
                }
            }


            await Training.update(updateData, {
                where: {
                    company_id: companyId,
                    id: id
                }
            });

            res.on("finish", async () => {
                History.create("Training Updated", req, ObjectName.TRAINING, id);
            });

            res.json(Response.OK, {
                message: "Training Update",
            });
        } catch (err) {
            console.log(err);
        }


    }

    static async delete(req, res, next) {
        try{

        const { id } = req.params;

        let companyId = Request.GetCompanyId(req);

        if (!id) {
            return res.json(BAD_REQUEST, { message: "Training id required" });
        }
        if (!companyId) {
            return res.json(BAD_REQUEST, { message: "CompanyId required" });
        }

        const trainingDetail = await Training.findOne({ where: { id } });
        if (!trainingDetail) {
            return res.json(BAD_REQUEST, { message: "Training not found", });
        }

        await trainingDetail.destroy();

        res.on("finish", async () => {
            History.create("Training deleted", req, ObjectName.TRAINING, id);
        });

        res.json(Response.DELETE_SUCCESS, { message: "Training deleted" });
    }catch (err){
        console.log(err);
    }
    }
}

module.exports = TrainingService;