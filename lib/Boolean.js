
class Boolean {
    static get(value) {
        let boolValue = value == undefined ? false : value == true ? true : false;
        return boolValue;
    }

    static isTrue(value) {
        return value === true
    }
}
module.exports = Boolean;
