const currentTime = new Date()
const hours = currentTime.getHours()
const minutes = currentTime.getMinutes()
const seconds = currentTime.getSeconds()
const day = currentTime.getDay()
const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thur.", "Fri.", "Sat."]
// //(seconds)
let newHour;
let newSeconds;
let newMinute
let amPm;
hours > 12 ? newHour = hours % 12 : newHour = hours
hours > 12 ? amPm = "pm" : amPm = "am"
seconds < 10 ? newSeconds = `0${seconds}` : newSeconds = seconds
minutes < 10 ? newMinute = `0${minutes}` : newMinute = minutes

let fullTime = `${weekdays[day]}/${newHour}:${newMinute}:${newSeconds} ${amPm}`
// setTime(fullTime)
time = fullTime



const getCurrentDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// console.log(getCurrentDateString()); // Example output: "2023-05-24"

module.exports={getCurrentDateString}