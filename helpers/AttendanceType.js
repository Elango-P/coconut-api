const Type ={
     ADDITIONAL_DAY_TEXT: "Additional Day",
     ADDITIONAL_SHIFT_TEXT: "Additional Shift",
     ADDITIONAL_LEAVE_TEXT: "Additional Leave",
     LEAVE_TEXT: "Leave",
     WORKING_DAY_TEXT: "Working Day",

     ADDITIONAL_DAY:1,
     ADDITIONAL_SHIFT: 2,
     ADDITIONAL_LEAVE: 3,
     LEAVE: 4,
     WORKING_DAY: 5,

}
const Status ={
    STATUS_ACTIVE_TEXT:"Active",
    STATUS_INACTIVE_TEXT:"InActive",
    
    STATUS_ACTIVE:1,
    STATUS_INACTIVE:2,
}

const typeOptions =[
    {
        label: Type.ADDITIONAL_DAY_TEXT,
        value:Type.ADDITIONAL_DAY
    },
    {
        label:Type.ADDITIONAL_SHIFT_TEXT,
        value:Type.ADDITIONAL_SHIFT
    },
    {
        label: Type.ADDITIONAL_LEAVE_TEXT,
        value: Type.ADDITIONAL_LEAVE
    },
    {
        label: Type.LEAVE_TEXT,
        value: Type.LEAVE
    },
    {
        label:Type.WORKING_DAY_TEXT,
        value:Type.WORKING_DAY
    },
]

const statusOptions =[
    {
        label: Status.STATUS_ACTIVE_TEXT,
        value: Status.STATUS_ACTIVE
    },
    {
        label: Status.STATUS_INACTIVE_TEXT,
        value: Status.STATUS_INACTIVE
    }
]

module.exports ={
    typeOptions,
    statusOptions,
    Type,
    Status
}