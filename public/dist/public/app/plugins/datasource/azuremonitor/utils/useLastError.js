import { useState, useCallback, useMemo } from 'react';
import { messageFromElement } from './messageFromError';
export default function useLastError() {
    const [errors, setErrors] = useState([]);
    // Handles errors from any child components that request data to display their options
    const addError = useCallback((errorSource, error) => {
        setErrors((errors) => {
            const errorsCopy = [...errors];
            const index = errors.findIndex(([vSource]) => vSource === errorSource);
            // If there's already an error, remove it. If we're setting a new error
            // below, we'll move it to the front
            if (index > -1) {
                errorsCopy.splice(index, 1);
            }
            // And then add the new error to the top of the array. If error is defined, it was already
            // removed above.
            if (error) {
                errorsCopy.unshift([errorSource, error]);
            }
            return errorsCopy;
        });
    }, []);
    const errorMessage = useMemo(() => {
        const recentError = errors[0];
        return recentError && messageFromElement(recentError[1]);
    }, [errors]);
    return [errorMessage, addError];
}
//# sourceMappingURL=useLastError.js.map