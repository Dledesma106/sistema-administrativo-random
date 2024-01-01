import { useContext } from 'react';

import AlertContext, { type AlertContextProps } from './AlertContext';

export default function useAlert(): AlertContextProps {
    const context = useContext(AlertContext);
    return context;
}
