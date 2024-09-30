const { Op } = require("sequelize");
const { companyService } = require("../../../services/CompanyService");
const Request = require("../../../lib/request");
const PageBlockService = require("../../../services/PageBlockService");
const PageBlockFieldsService = require("../../../services/PageBlockFieldsService");
const MediaService = require("../../../services/MediaService");
const ObjectName = require("../../../helpers/ObjectName");
const { loadSettingByName } = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");
const ArrayList = require("../../../lib/ArrayList");
const { PageBlockFields, Media: MediaModal } = require("../../../db").models;



const get = async (req, res, next) => {


    const baseUrl = req.header("origin");

    let companyId;
    let settingList = await loadSettingByName(Setting.ONLINE_SALE_COMPANY);

        if (ArrayList.isNotEmpty(settingList)) {

            let settingData = settingList.find((data) => data.value);

            companyId = settingData ? settingData.get().company_id :  await Request.GetCompanyIdBasedUrl(baseUrl);

        }else{
            companyId = await Request.GetCompanyIdBasedUrl(baseUrl);
        }
    let pageBlockList = await PageBlockService.search(companyId);
    let PageBlockListArray = []
    let PageBlockFieldsList;
    let getMediaId;
    if (pageBlockList && pageBlockList.length > 0) {
        for (let i = 0; i < pageBlockList.length; i++) {
            const { id: page_block_id, title } = pageBlockList[i];
             PageBlockFieldsList = await PageBlockFieldsService.list(page_block_id, companyId);
            let PageBlockFieldsListArray = []
            if (PageBlockFieldsList && PageBlockFieldsList.length > 0) {
                for (let i = 0; i < PageBlockFieldsList.length; i++) {
                    const { title, description, media_id, id } = PageBlockFieldsList[i];
                     getMediaId = await MediaModal.findOne({
                        where: { object_id: id, object_name: ObjectName.PAGE_BLOCK_FIELDS, company_id: companyId, }, order: [["createdAt", "DESC"]]
                    });
                    PageBlockFieldsListArray.push({
                        title,
                        description,
                        media_url: await MediaService.getMediaURL(getMediaId?.id, companyId)
                    })

                }
            }
            if (PageBlockFieldsListArray && PageBlockFieldsListArray.length > 0) {
                PageBlockListArray.push({
                    title: title,
                    PageBlockFieldsListArray: PageBlockFieldsListArray
                })
            }

        }
    }

    res.json(200, {
        data: PageBlockListArray
    })





}
module.exports = get;