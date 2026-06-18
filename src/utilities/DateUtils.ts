import moment from 'moment';
import 'moment-timezone'; 

type DateFormat = 'ddmmyy' | 'yymmdd' | 'yyyymmdd';

/**
 * Gets yesterday's date in the specified format.
 * @param format Date format ('ddmmyy', 'yymmdd', 'yyyymmdd')
 * @returns Formatted date or Date object
 */
export const GetYesterday = (format: DateFormat): string | Date => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const day = "" + yesterday.getDate();
    const month = "" + (yesterday.getMonth() + 1);
    const year = yesterday.getFullYear();
    
    let paddedMonth = month;
    let paddedDay = day;
    if (paddedMonth.length < 2) paddedMonth = "0" + paddedMonth;
    if (paddedDay.length < 2) paddedDay = "0" + paddedDay;
    
    switch (format) {
        case "ddmmyy":
            return [paddedDay, paddedMonth, year].join("-");
        case "yymmdd":
            return [year, paddedMonth, paddedDay].join("-");
        case "yyyymmdd":
            return `${year}${paddedMonth}${paddedDay}`;
        default:
            return yesterday;
    }
};

/**
 * Gets today's date in the specified format.
 * @param format Date format ('ddmmyy', 'yymmdd', 'yyyymmdd')
 * @returns Formatted date or Date object
 */
export const GetToday = (format: DateFormat): string | Date => {
    const today = new Date();
    const day = "" + today.getDate();
    const month = "" + (today.getMonth() + 1);
    const year = today.getFullYear();
    
    let paddedMonth = month;
    let paddedDay = day;
    if (paddedMonth.length < 2) paddedMonth = "0" + paddedMonth;
    if (paddedDay.length < 2) paddedDay = "0" + paddedDay;
    
    switch (format) {
        case "ddmmyy":
            return [paddedDay, paddedMonth, year].join("-");
        case "yymmdd":
            return [year, paddedMonth, paddedDay].join("-");
        case "yyyymmdd":
            return `${year}${month}${day}`;
        default:
            return today;
    }
};

/**
 * Gets tomorrow's date in the specified format.
 * @param format Date format ('ddmmyy', 'yymmdd')
 * @returns Formatted date or Date object
 */
export const GetTomorrow = (format: DateFormat): string | Date => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = "" + tomorrow.getDate();
    const month = "" + (tomorrow.getMonth() + 1);
    const year = tomorrow.getFullYear();
    
    let paddedMonth = month;
    let paddedDay = day;
    if (paddedMonth.length < 2) paddedMonth = "0" + paddedMonth;
    if (paddedDay.length < 2) paddedDay = "0" + paddedDay;
    
    switch (format) {
        case "ddmmyy":
            return [paddedDay, paddedMonth, year].join("-");
        case "yymmdd":
            return [year, paddedMonth, paddedDay].join("-");
        case "yyyymmdd":
            return `${year}${paddedMonth}${paddedDay}`;
        default:
            return tomorrow;
    }
};

/**
 * Gets the first day of the month in the specified format.
 * @param format Date format ('ddmmyy', 'yymmdd')
 * @returns Formatted date or Date object
 */
export const GetFirstMonthDay = (format: DateFormat): string | Date => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const day = "01";
    let month = "" + (today.getMonth() + 1);
    const year = today.getFullYear();
    
    if (month.length < 2) month = "0" + month;
    
    switch (format) {
        case "ddmmyy":
            return [day, month, year].join("-");
        case "yymmdd":
            return [year, month, day].join("-");
        case "yyyymmdd":
            return `${year}${month}${day}`;
        default:
            return firstDay;
    }
};

/**
 * Formats a date in the format 'DD [of] MMMM [of] YYYY hh:mm a'.
 * @param date Date to format
 * @returns Formatted date
 */
export const FormatedDate = (date: Date | string): string => {
    return moment(date).locale('es').format('DD [of] MMMM [of] YYYY hh:mm a');
};

/**
 * Formats a date in the format 'DD-MMM-YYYY'.
 * @param date Date to format
 * @returns Formatted date
 */
export const FormatedDateShort = (date: Date | string): string => {
    return moment(date).locale('es').format('DD-MMM-YYYY');
};

export const FormatedDateShort2 = (date: Date | string): string => {
    return moment(date).locale('es').format('YYYY-MM-DD');
};

export const FormatedDateTime = (date: Date | string): string => {
    return moment(date).locale('es').format('DD/MM/YYYY HH:mm:ss');
};

/**
 * Formats a date to display time and minutes, with options for 12/24 hour format and showing seconds.
 * @param date Date to format
 * @param use24HourFormat If true, uses 24-hour format; if false, uses 12-hour format with AM/PM (default is false)
 * @param showSeconds If true, shows seconds; by default it doesn't show them
 * @returns Time formatted as string
 */
export const FormatTime = (date: Date | string, use24HourFormat: boolean = false, showSeconds: boolean = false): string => {
    let formatString = use24HourFormat ? 'HH:mm' : 'hh:mm A';  // Formato 24h o 12h con AM/PM
    if (showSeconds) {
        formatString = use24HourFormat ? 'HH:mm:ss' : 'hh:mm:ss A';  // Incluye segundos si es necesario
    }
    return moment(date).format(formatString);
};

/**
 * Adds days to a date.
 * @param fecha Initial date
 * @param days Number of days to add
 * @returns Date in ISO format
 */
export const DateAdd = (fecha: Date, days: number): string => {
    const added = 86400000 * days; 
    return new Date(fecha.getTime() + added).toISOString().split("T")[0];
};

/**
 * Converts milliseconds to minutes.
 * @param ms Milliseconds
 * @returns Minutes
 */
export const MsInMinutes = (ms: number): number => {
    return Math.round(((ms % 86400000) % 3600000) / 60000);
};

/**
 * Converts milliseconds to hours.
 * @param ms Milliseconds
 * @returns Hours
 */
export const MsInHours = (ms: number): number => {
    return Math.floor((ms % 86400000) / 3600000);
};

/**
 * Converts milliseconds to days.
 * @param ms Milliseconds
 * @returns Days
 */
export const MsInDays = (ms: number): number => {
    return Math.floor(ms / 86400000);
};

/**
 * Gets the current date and time in the specified timezone.
 * If not specified, uses America/Guayaquil timezone.
 * @param timezone Timezone (default 'America/Guayaquil')
 * @returns Date and time formatted as string in 'YYYY-MM-DDTHH:mm:ss.ms' format
 */
export const GetDateTime = (timezone: string = 'America/Guayaquil'): string => {
    return moment.tz(timezone).format('YYYY-MM-DDTHH:mm:ss.ms');
};

export const ConvertSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;  
};