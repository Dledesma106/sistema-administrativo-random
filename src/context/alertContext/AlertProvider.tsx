import AlertContext from './AlertContext';

import { useToast } from '@/components/ui/use-toast';

import { type ProviderProps } from '../interfaces';

export type AlertType = 'Success' | 'Failure' | 'Info';

export interface IAlert {
    key?: string;
    message: string;
    type: AlertType;
}

const AlertProvider = ({ children }: ProviderProps): JSX.Element => {
    const { toast } = useToast();

    return (
        <AlertContext.Provider
            value={{
                triggerAlert: (alert: IAlert) => {
                    toast({
                        variant:
                            alert.type === 'Info'
                                ? 'default'
                                : alert.type === 'Success'
                                  ? 'success'
                                  : 'destructive',
                        // title: 'Uh oh! Something went wrong.',
                        description: alert.message,
                    });
                },
                removeAlert: () => {
                    return null;
                },
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;
