import { useState } from 'react';

export type AlertType = 'Success' | 'Failure' | 'Warning' | 'Info';

interface Alert {
    type: AlertType;
    message: string;
}

export function useAlert() {
    const [alert, setAlert] = useState<Alert | null>(null);

    const triggerAlert = (alert: Alert) => {
        setAlert(alert);

        // Auto-dismiss alert after 3 seconds
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    };

    return {
        alert,
        triggerAlert,
    };
}
