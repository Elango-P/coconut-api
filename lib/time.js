const moment = require("moment");

class Time {

    static getTimeDiff(startTime, endTime) {

        if (startTime && endTime) {

            let startTimeFormat = moment(startTime, 'HH:mm:ss');

            let endTimeFormat = moment(endTime, 'HH:mm:ss');

            let duration = moment.duration(startTimeFormat.diff(endTimeFormat));

            return Math.floor(duration.asHours())

        }
    }

    static getHours(hour) {
        if (hour) {
            return hour * 60;
        }
    }

    static formatHoursMinutes(decimalHours) {

        let hours = Math.floor(decimalHours);

        let decimalPart = decimalHours - hours;
        let minutes = Math.round(decimalPart * 60);

        let formattedTime = hours + " hours " + minutes + " minutes";

        if (hours > 0 && minutes > 0) {
            formattedTime = hours + " hours " + minutes + " minutes";
        } else if (hours > 0) {
            formattedTime = hours + " hours";
        } else if (minutes > 0) {
            formattedTime = minutes + " minutes"
        }

        return formattedTime;
    }

    static getUserTimeZoneTime(timeString, targetTimeZone, is12Hour) {
        // Create a Date object with the input time
        const date = new Date(`1970-01-01T${timeString}Z`);

        // Convert to the target time zone
        const formattedTime = date.toLocaleString('en-US', {
            hour12: is12Hour,
            timeZone: targetTimeZone,
            hour: '2-digit',
            minute: '2-digit',
        });

        return formattedTime;
    }

    static compareTimes(timeString1, timeString2) {
        

        const [time1DefaultHours, time1DefaultMinutes] = timeString1 && timeString1.split(':').map(Number);
       
        const time1TotalSeconds = (time1DefaultHours * 3600) + (time1DefaultMinutes * 60);

        const [time2DefaultHours, time2DefaultMinutes] = timeString2 && timeString2.split(':').map(Number);

        const time2TotalSeconds = (time2DefaultHours * 3600) + (time2DefaultMinutes * 60);

        return time1TotalSeconds - time2TotalSeconds;
 
    }

    static getTime(dateAndTime) {
        if (dateAndTime) {
            dateAndTime = new Date(dateAndTime);
            const hours = dateAndTime.getHours();
            const minutes = dateAndTime.getMinutes();
            const seconds = dateAndTime.getSeconds();

            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            return timeString;
        }
    }

    static formatTime(timeString) {
       
        const [hours, minutes] = timeString.split(":").map(Number);
        
        let meridian = "AM";

        if (hours >= 12) {
            meridian = "PM";
        }

        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

        const formattedTimeString = `${formattedHours.toString()}:${minutes == 0 ? '00' : minutes} ${meridian}`;

        return formattedTimeString
         
    }

    static convertToUserTimeZone(dateString, timeZone) {
        const options = {
          timeZone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        };
      
        return new Date(dateString).toLocaleString(undefined, options);
      }
}

module.exports = Time;