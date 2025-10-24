import { useState } from 'react';
import { getPositiveNumberError, isValidPositiveNumber } from '@/utils/validations';

export const useLocalErrors = () => {
    const [localErrors, setLocalErrors] = useState({});

    const validateAndSetError = (key, value, fieldName) => {
        if (!isValidPositiveNumber(value)) {
            setLocalErrors(prevErrors => ({
                ...prevErrors,
                [key]: getPositiveNumberError(fieldName),
            }));
            return false; // Indica que hay error
        }
        // Limpiar el error si el valor es válido
        setLocalErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[key];
            return newErrors;
        });
        return true; // Indica que es válido
    };

    return { localErrors, validateAndSetError };
};