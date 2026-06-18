/**
 * Formats a number with decimals and thousand separators.
 * @param value Number to format
 * @param decimals Number of decimal places (default 2)
 * @returns Formatted number as string
 */
export const FormatNumberWithDecimal = (value: number | undefined, decimals: number = 2): string => {
    
    if(value === undefined )
        return '-';
    
    if (value !== undefined && Number.isInteger(value)) {
        value = parseFloat(value.toFixed(decimals));
    }
    
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true
    }).format(value ?? 0);
};

/**
 * Formats a number with the dollar sign at the beginning and two decimal places, removing commas.
 * @param value Number to format
 * @returns Number formatted as string with dollar sign and two decimal places
 */
export const FormatMoney = (value: number | string, decimals: number = 2): string => {
    value = '' + value;
    const numberValue = parseFloat(value.replace(/,/g, ''));
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(numberValue);
    return formattedValue;
};

/**
 * Formats a number with two decimal places and adds the percentage sign at the end.
 * @param value Number to format
 * @returns Number formatted as string with two decimal places and the percentage sign
 */
export const FormatPercentage = (value: number | string, decimals: number = 2): string => {
    value = '' + value;
    const formattedValue = parseFloat(value.replace(/,/g, '')).toFixed(decimals);
    return `${formattedValue}%`;
};

/**
 * Removes all non-numeric characters from a string.
 * @param value String to clean
 * @returns String with only numbers
 */
export const OnlyNumbers = (value: string): string => value.replace(/[^\d]/g, '');

/**
 * Removes non-numeric characters from a string, allowing only one decimal point.
 * @param value String to clean
 * @returns String with only numbers and one decimal point
 */
export const OnlyDecimal = (value: string): string => {
    const parts = value.split('.');
    if (parts.length > 2) {
        const lastPart = parts.pop();
        const firstPart = parts.join('');
        return `${firstPart}.${lastPart?.replace(/[^\d]/g, '')}`;
    } else if (parts.length === 2) {
        return `${parts[0]}.${parts[1].replace(/[^\d]/g, '')}`;
    } else {
        return value.replace(/[^\d]/g, '');
    }
};

/**
 * Analyzes a string to allow only up to two decimal places.
 * @param value String to analyze
 * @returns Valid string with up to two decimal places
 */
export const ParseDecimals = (value: string): string => {
    const re = /^\d+(\.\d{0,2})?$/;
    if (value === '' || re.test(value)) {
        return value;
    } else {
        return value.slice(0, -1);
    }
};

/**
 * Formats a size in bytes to a readable string.
 * @param a Size in bytes
 * @param b Number of decimal places to display (default 2)
 * @returns Formatted size as string
 */
export const FormatBytes = (a: number, b: number = 2): string => {
    if (!+a) return "0 B";
    const c = Math.max(0, b);
    const d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
        }`;
};