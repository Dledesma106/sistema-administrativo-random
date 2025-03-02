import { createContext } from 'react';

import type { IAlert } from './AlertProvider';

export interface AlertContextProps {
    triggerAlert: (alert: IAlert) => void;
    removeAlert: (key: string) => void;
}

const AlertContext = createContext<AlertContextProps>({} as AlertContextProps);

export default AlertContext;
