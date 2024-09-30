class ObjectHelper {
  static createEmptyRecord(data) {
    try {
      const emptyOrder = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          emptyOrder[key] = "";
        }
      }
      return emptyOrder;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ObjectHelper;
