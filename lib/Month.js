const Number = require("./Number");

class Month {
  static getValue(name) {
    const monthOption = [
      { label: "January", value: 1 },
      { label: "February", value: 2 },
      { label: "March", value: 3 },
      { label: "April", value: 4 },
      { label: "May", value: 5 },
      { label: "June", value: 6 },
      { label: "July", value: 7 },
      { label: "August", value: 8 },
      { label: "September", value: 9 },
      { label: "October", value: 10 },
      { label: "November", value: 11 },
      { label: "December", value: 12 },
    ];

    const month = monthOption.filter(
      (option) =>
        option.label.toLowerCase().includes(String(name).toLowerCase()) ||
        option.value == name
    );

    if (month && month.length > 0) {
      let monthValue = month.map((data) => data.value);
      return monthValue;
    } else {
      return null;
    }
  }

  static get(data) {
    const monthOption = [
      { label: "January", value: 1 },
      { label: "February", value: 2 },
      { label: "March", value: 3 },
      { label: "April", value: 4 },
      { label: "May", value: 5 },
      { label: "June", value: 6 },
      { label: "July", value: 7 },
      { label: "August", value: 8 },
      { label: "September", value: 9 },
      { label: "October", value: 10 },
      { label: "November", value: 11 },
      { label: "December", value: 12 },
    ];
    if (Number.isNotNull(data)) {
      let month = monthOption.find((value) => value.value == data);
      return month.label;
    }
    return ""
  }
}

module.exports = Month;
