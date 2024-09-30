

class Number {
  static Get(number, defaultValue = null) {
    if (number && number !== "undefined" && number !== undefined && number !=="" && number !=="null") {
    let formatData = number ? parseInt(number) : defaultValue;
    return formatData;
    }else{
      return null
    }
  }

  static GetPositiveOnly(number, defaultValue = null) {
    number = number ? parseInt(number) : defaultValue;
    number = number >= 0 ? number : defaultValue;
    return number;
  }

  static GetPositiveNumber(number) {
    return Math.abs(number);
  }

  static GetFloat(number,defaultValue = null) {
    try {
      if (number && number !== "undefined" && number !== undefined && number !=="" && number !=="null") {
        let formatData = number? parseFloat(number):defaultValue;

        if(formatData == 0){
          return 0
        }else if(formatData){
          let floatNumber = formatData.toFixed(2);

          return parseFloat(floatNumber);
        }
      }else{
      return null;
      }
    } catch (err) {
      console.log(err);
    }
  }

  static Multiply(number1, number2) {
    try {
      if (number1 && number2) {
        return this.GetFloat(number1) * this.GetFloat(number2);
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static Addition(number1, number2) {
    try {
      if (number1 && number2) {
        return this.GetFloat(number1) + this.GetFloat(number2);
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static Subtraction(number1, number2) {
    try {
      if (number1 && number2) {
        return this.GetFloat(number1) - this.GetFloat(number2);
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static Division(number1, number2) {
    try {
      if (number1 && number2) {
        return this.GetFloat(number1) / this.GetFloat(number2);
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static getPercentageValue(number, percentage) {
    try {
      if (number && percentage) {
        let percentageValue = this.GetFloat(number) * (this.GetFloat(percentage) / 100);

        if (percentageValue) {
          return this.GetFloat(percentageValue);
        }
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static Decimal(data) {
    if (data !== null && !isNaN(data)) {
      let value = parseFloat(data).toFixed(2);
      return parseFloat(value);
    } else {
      return parseFloat(0.0);
    }
  }

  static truncateDecimal(number, decimalPlaces) {
    const parts = number.toString().split('.');
    if (parts[1] && parts[1].length > decimalPlaces) {
      return parseFloat(parts[0] + '.' + parts[1].slice(0, decimalPlaces));
    }
    return number;
  }

  static roundOff(number) {
    if (number) {
      return Math.round(number);
    } else {
      return null;
    }
  }

  static isNotNull(value) {
    if (value && value !== "undefined" && value !== undefined && value !=="" && value !=="null") {
      return true;
    }
    return false;
  }
  static isNull(value) {
    if (value && value === "undefined" || value === undefined || value ==="" || value ==="null" || value === null) {
      return true;
    }
    return false;
  }

  static GetPercentage(number) {
    try {
      if (number) {
        let formatData = parseFloat(number);

        if (formatData) {
          let percentageValue = formatData.toFixed(2);

          return parseFloat(percentageValue);
        }
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static GetCurrency(number) {
    try {
      if (number) {
        let formatData = parseFloat(number);

        if (formatData) {
          let currencyValue = formatData.toFixed(2);

          return parseFloat(currencyValue);
        }
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  static isEven(number) {
    return number % 2 === 0;
  };

  static isOdd(number) {
    return number % 2 !== 0;
  };
}
module.exports = Number;