import { useState } from 'react';

import LoadingContext from './LoadingContext';

import { type ProviderProps } from '../interfaces';

const INITIAL_STATE = false;

const LoadingProvider = ({ children }: ProviderProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(INITIAL_STATE);

    function startLoading(): void {
        setIsLoading(true);
    }

    function stopLoading(): void {
        setIsLoading(false);
    }

    return (
        <LoadingContext.Provider
            value={{
                isLoading,
                startLoading,
                stopLoading,
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;
