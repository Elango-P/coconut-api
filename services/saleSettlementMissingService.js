const { SaleSettlement, Location: locationModel, Project, Shift, Ticket, ProjectTicketType } = require("../db").models;
const DateTime = require("../lib/dateTime");
const saleSettlement = require("../helpers/SaleSettlement");
const ShiftStatus = require("../helpers/ShiftStatus");
const Location = require("../helpers/Location");
const { ALLOW_SALE } = require("../helpers/Sales");
const { getValueByObject } = require("./SettingService");
const Setting = require("../helpers/Setting");
const StatusService = require("../services/StatusService");
const ObjectName = require("../helpers/ObjectName");
const Request = require("../lib/request");

const TicketService = require("../services/TicketService");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const History = require("./HistoryService");

const list = async (req, res, params) => {
  let companyId = Request.GetCompanyId(req);

  try {
    let storeList = await locationModel.findAll({
      where: {
        status: Location.STATUS_ACTIVE,
        allow_sale: ALLOW_SALE,
        company_id: companyId,
        sales_settlement_required:Location.SALES_SETTLEMENT_REQUIRED_ENABLED
      },
    });

    const defaultType = await getValueByObject(Setting.SALE_SETTLEMENT_MISSING_TICKET_TYPE, params.settingArray);

    let ticketTypeData = await ProjectTicketType.findOne({
      where: { id: defaultType, company_id: companyId },
      attributes: ["project_id", "id", "name"],
    });

    const status = await StatusService.getFirstStatus(ObjectName.TICKET, companyId, ticketTypeData?.project_id);

    let shiftList = await Shift.findAll({
      where: {
        company_id: companyId,
        status: ShiftStatus.ACTIVE,
      },
    });

    let createDataArray = [];

    if (storeList && storeList.length > 0) {
      for (let i = 0; i < storeList.length; i++) {
        let endDate = storeList[i].end_date ? storeList[i].end_date : new Date();

        if (storeList[i].start_date) {
          // get time range
          const dates = DateTime.getDatesInRange(storeList[i].start_date, endDate);

          // validate date length exist or not
          if (dates && dates.length > 0) {
            // loop the dates
            for (let j = 0; j < dates.length; j++) {
              // validate date

              if (dates[j]) {
                // get shift list

                if (shiftList && shiftList.length > 0) {
                  for (let k = 0; k < shiftList.length; k++) {
                    let saleExist = await SaleSettlement.findOne({
                      where: {
                        company_id: companyId,
                        date: dates[j],
                        shift: shiftList[k].id,
                        store_id: storeList[i].id,
                      },
                    });

                    //validaet a shift sales exist or not
                    if (!saleExist) {
                      let createData = {
                        createdAt: new Date(),
                        eta: new Date(),
                        company_id: companyId,
                        project_id: ticketTypeData?.project_id,
                        summary: `Sales Settlement Missing - ${DateTime.Format(dates[j])} ${storeList[i].name} ${
                          shiftList[k].name
                        }`,
                        status: status,
                        type_id: ticketTypeData?.id,
                        reporter_id: params.systemUser,
                      };

                      createDataArray.push(createData);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    const projectDetail = await Project.findOne({
      where: { company_id: companyId, id: ticketTypeData?.project_id },attributes:["last_ticket_number","code","id"]
    });

    let code = projectDetail?.code;
    

    let lastTicketNumber = projectDetail && projectDetail?.last_ticket_number;

    let ticketNumber = 1; // Initialize ticketNumber to 1

    if (lastTicketNumber) {

        ticketNumber = parseInt(lastTicketNumber) + 1;
    }
    const newTicketNumber = `${code}-${ticketNumber || 1}`;
    for (let i = 0; i < createDataArray.length; i++) {
      let createData = {
        createdAt: createDataArray[i].createdAt,
        eta: createDataArray[i].eta,
        company_id: createDataArray[i].company_id,
        project_id: createDataArray[i].project_id,
        summary: createDataArray[i].summary,
        assignee_id: createDataArray[i].assignee_id,
        status: createDataArray[i].status,
        type_id: createDataArray[i].type_id,
        reporter_id: createDataArray[i].reporter_id,
        ticket_number: newTicketNumber,
      };

      let [ticketData, created] = await Ticket.findOrCreate({
        where: {
          summary: createData.summary,
          company_id: companyId,
        },
        defaults: createData,
      });

      if (created == true) {
        ticketNumber++;

        await Project.update({last_ticket_number:ticketNumber},{where:{id:projectDetail?.id, company_id:companyId}})

        await TicketService.reindex(ticketData?.id, companyId);
      }
    }
    await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    History.create(`${params.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, params.id, params.systemUser);
  } catch (err) {
    throw { message: err };
  }
};

module.exports = {
  list,
};
