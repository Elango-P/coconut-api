const Number = require("./Number");

class ArrayList {
  // Array List is Empty
  static isEmpty = (arrayList) => {
    if (arrayList && arrayList.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  // Array List is Not Empty
  static isNotEmpty = (arrayList) => {
    return !this.isEmpty(arrayList);
  };

  // Array List is Not Empty
  static removeDuplicate = (arrayList) => {
    if (this.isNotEmpty(arrayList)) {
      let uniqueArr = arrayList.reduce((result, obj) => {
        let duplicate = result.find((o) => o.id === obj.id);
        if (!duplicate) {
          result.push(obj);
        }
        return result;
      }, []);

      return uniqueArr;
    }
    return [];
  };

  static sort = (data, sort, sortDirection) => {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
  
    let sortArray = data.sort((a, b) => {
      const aValue = a[sort] !== undefined && a[sort] !== null ? a[sort] : null;
      const bValue = b[sort] !== undefined && b[sort] !== null ? b[sort] : null;
    
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
    
      if (sortDirection === 'ASC') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });
    
    return sortArray;
  };
  /**
   * Is data False
   * @param value
   */

  static StringIntoArray = (string) => {
    let arrayData =[];
    if (string) {
      arrayData = string.split(',');

      if (arrayData && arrayData.length > 0) {
        arrayData = arrayData.map((data) => parseInt(data));
      }
    }

    return arrayData;
  };
  static groupBy = (data) => {
    const groupedData = data.reduce((acc, { date, quantity }) => {
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += quantity;
      return acc;
    }, {});

    const groupedDataArray = Object.entries(groupedData).map(([date, quantity]) => ({ date, quantity }));
    return groupedDataArray;
  };
  static groupByName = (data) => {
    const groupedData = data.reduce((acc, { name, quantity }) => {
      if (!acc[name]) {
        acc[name] = 0;
      }
      acc[name] += quantity;
      return acc;
    }, {});

    const groupedDataArray = Object.entries(groupedData).map(([name, quantity]) => ({ name, quantity }));
    let arrayValue = groupedDataArray.sort((a, b) => a.name.localeCompare(b.name));
    return arrayValue;
  };


  static getLength(array) {
    return array && array.length > 0 ? array.length : 0
  }

  static splitArray(array, numberOfElement) {
    try {
      const chunks = [];
      if (array && array.length > 0) {
        for (let i = 0; i < array.length; i += numberOfElement) {
          const chunk = array.slice(i, i + numberOfElement);
          chunks.push(chunk);
        }
      }
      return chunks;

    } catch (err) {
      console.log(err);
    }
  }

  static mapByKey = (arrayList, key1, key2) => {
    try{
      if(arrayList && arrayList.length>0){
    return arrayList.reduce((map, item) => {
      if (item[key1]) {
        const key = item[key2] ? `${item[key1]}-${item[key2]}` : `${item[key1]}`;
        map[key] = item;
      }
      return map;
    }, {})
  }else{
    return null
  }
  }catch(err){
    console.log(err);
  }
  };

  static isArray(arrayList){
    if(arrayList && Array.isArray(arrayList) && arrayList.length > 0){
      return true
    }
    return false
  }


  static get(value) {
    if (Number.isNotNull(value)) {
      if (ArrayList.isArray(value)) {
        if (ArrayList.isArray(value)) {
          return value
        }
      } else if (typeof value === "string") {
        let arrayValues = value?.split(",");
        if (ArrayList.isArray(arrayValues)) {
          return arrayValues
        }
      } else {
        return [value];
      }
    } else {
      return [];
    }
  }

}

module.exports = ArrayList;
