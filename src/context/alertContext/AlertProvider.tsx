import { nanoid } from 'nanoid';
import { useState } from 'react';

import AlertContext from './AlertContext';

import Alert from '@/components/Alert';

import { type ProviderProps } from '../interfaces';

export type AlertType = 'Success' | 'Failure' | 'Info';

export interface IAlert {
    key?: string;
    message: string;
    type: AlertType;
}

const INITIAL_STATE = [] as IAlert[];

const AlertProvider = ({ children }: ProviderProps): JSX.Element => {
    const [alerts, setAlerts] = useState<IAlert[]>(INITIAL_STATE);

    function triggerAlert(newAlert: IAlert): void {
        newAlert.key = nanoid();
        setAlerts([...alerts, newAlert]);
        setTimeout(() => {
            removeAlert(newAlert.key as string);
        }, 5000);
    }

    function removeAlert(key: string): void {
        setAlerts(alerts.filter((alert) => alert.key !== key));
    }

    return (
        <AlertContext.Provider
            value={{
                triggerAlert,
                removeAlert,
            }}
        >
            {children}
            <>
                {alerts.map((alert) => (
                    <Alert key={alert.key} id={alert.key as string} {...alert} />
                ))}
            </>
        </AlertContext.Provider>
    );
};

export default AlertProvider;
