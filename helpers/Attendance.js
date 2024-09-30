
const ObjectName = require("../helpers/ObjectName")

const crypto = require("../lib/crypto");


module.exports = {

    async getQRCode(companyId, storeId){
        
        let encryptText = `${ObjectName.ATTENDANCE}+${storeId}+${companyId}`

       return await crypto.encrypt(encryptText.toString())
    },
    TYPE_WORKING_DAY : "Working Day",
    TYPE_ADDITIONAL_DAY: "Additional Day",
    TYPE_LEAVE: "Leave",
    TYPE_ABSENT:"Absent",
    TYPE_LATE_HOURS:"Late Hours",
    LOGIN:"login",
    TYPE_ADDITIONAL_LEAVE: "Additional Leave",
}
