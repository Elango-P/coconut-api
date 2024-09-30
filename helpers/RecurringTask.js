// TypeOptions
const typeOptions = [
    {
      label: "Days",
      value: "Days"
    },
    {
      label: "Week",
      value: "Week"
    },
    {
      label: "Month",
      value: "Month"
    },
    {
      label: "Year",
      value:  "Year"
    }
  ];
  // TypeOptions
  const DayOptions = [
    {
      label: "Monday",
      value: 1
    },
    {
      label: "Tuesday",
      value: 2
    },
    {
      label: "Wednesday",
      value: 3
    },
    {
      label: "Thursday",
      value: 4
    },
    {
      label: "Friday",
      value: 5
    },
    {
      label: "Saturday",
      value: 6
    },
    {
      label: "Sunday",
      value: 7
    }
  ];

   const WeekOptions =[
    {
      label:"Week 1",
      value:1
    },
    {
      label:"Week 2",
      value:2
    },
    {
      label:"Week 3",
      value:3
    },
    {
      label:"Week 4",
      value:4
    },
  ]

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
    { label: "December", value: 12 }
  ];

const TaskType = {
  MONTHLY: "Monthly",
  DAILY: "Daily",
  ANNUALLY: "Annually",
  WEEKLY: "Weekly"
}


module.exports = {
    monthOption,
    typeOptions,
    WeekOptions,
    DayOptions,
    TaskType
  };