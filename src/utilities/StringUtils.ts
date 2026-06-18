/**
 * Capitalizes the first letter of each word in a string.
 * @param input String to capitalize
 * @returns String with the first letter of each word in uppercase
 */
export const Capitalize = (input: string | undefined): string => {
    if (input && input.length > 1) {
        const words = input.split(' ');
        const CapitalizedWords = words.map((word) => {
            return (word[0] || 'A').toUpperCase() + word.substring(1).toLowerCase();
        });
        return CapitalizedWords.join(' ');
    }
    return '';
};

/**
 * Converts a string to lowercase.
 * @param input String to convert
 * @returns String in lowercase
 */
export const ToLowerCase = (input: string): string => {
    return typeof input === 'string' ? input.toLowerCase() : '';
};

/**
 * Converts a string to uppercase.
 * @param input String to convert
 * @returns String in uppercase
 */
export const ToUpperCase = (input: string): string => {
    return typeof input === 'string' ? input.toUpperCase() : '';
};

/**
 * Truncates a string.
 * @param text String to truncate
 * @param maxLength Maximum length of the truncated string
 * @returns Truncated string
 */
export const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};