const fs = require('fs');

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const longMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

// Function to search for all JSON files in a directory
function findJSONFiles(directory) {
    return fs.readdirSync(directory).filter((file) => file.endsWith('.json'));
}

function readJSONFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        exit(1)
    }
}

function safeReadJSONFile(filePath) {
    if (fs.existsSync(filePath)) {
        return readJSONFile(filePath)
    }
    return undefined
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getShortMonthByIndex(index) {
    return shortMonths[index]
}

function getShortMonth(date) {
    return shortMonths[date.getMonth()]
}

function getLongMonthIndex(month) {
    return longMonths.indexOf(month)
}

function isValidDate(str) {
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-9]|[1-2][0-9]|3[01], \d{4}$/;
    return regex.test(str);
}

function getDate(dateString) {
    if (dateString != "") {
        return new Date(dateString).toLocaleDateString(undefined, dateOptions);
    } else {
        return today()
    }
}

function today() {
    return new Date().toLocaleDateString(undefined, dateOptions);
}

// Input format: March 14, 2024
function formatMonthDDYYYY(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.match(/^(\w+)\s(\d{1,2}),\s(\d{4})$/);

    if (parts && parts.length === 4) {
        const year = parseInt(parts[3]);
        const monthIndex = getLongMonthIndex(parts[1]);
        const day = parseInt(parts[2]);

        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);

        // Format the date in the desired output format (e.g., "Dec 22, 2023")
        return `${getShortMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Return the original input if parsing fails
    return inputDate;
}

// Input format: 15th March 2023
function formatDDMonthYYYY(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.match(/^(\d{1,2})(st|nd|rd|th)\s(\w+)\s(\d{4})$/);

    if (parts && parts.length === 5) {
        const day = parseInt(parts[1]);
        const monthIndex = getLongMonthIndex(parts[3]);
        const year = parseInt(parts[4]);

        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);

        // Format the date in the desired output format (e.g., "Dec 22, 2023")
        return `${getShortMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Return the original input if parsing fails
    return inputDate;
}

// Input format: 2023-12-22
function formatYYYYMMDD(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.match(/(\d{4})-(\d{2})-(\d{2})/);

    if (parts && parts.length === 4) {
        const year = parseInt(parts[1]);
        const monthIndex = parseInt(parts[2]) - 1; // JavaScript Date months are 0-based
        const day = parseInt(parts[3]);

        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);

        // Format the date in the desired output format (e.g., "Dec 22, 2023")
        return `${getShortMonth(date)} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Return the original input if parsing fails
    return inputDate;
}

module.exports = {
    findJSONFiles,
    readJSONFile,
    safeReadJSONFile,
    sleep,
    getShortMonthByIndex,
    getShortMonth,
    getLongMonthIndex,
    isValidDate,
    getDate,
    today,
    formatMonthDDYYYY,
    formatDDMonthYYYY,
    formatYYYYMMDD
  };