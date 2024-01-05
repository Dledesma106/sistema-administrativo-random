import { createContext } from 'react';

export interface LoadingContextProps {
    isLoading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps>({} as LoadingContextProps);

export default LoadingContext;
