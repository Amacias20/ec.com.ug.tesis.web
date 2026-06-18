type ValidationSchema = {
    [key: string]: (value: any) => boolean;
};

type ValidationResult = {
    [key: string]: boolean;
};

export const validateFields = (fields: Record<string, any>, schema: ValidationSchema): ValidationResult => {
    const newValidation: ValidationResult = {};

    Object.keys(schema).forEach((field) => {
        newValidation[field] = schema[field](fields[field]);
    });

    return newValidation;
};

export const isRequired = (value: any): boolean => !!value;

export const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

export const isPhoneNumber = (value: string): boolean => {
    const phoneRegex = /^\(\+?\d{1,3}\)\s?\d{5,10}-\d{4}$/;
    return phoneRegex.test(value);
};
