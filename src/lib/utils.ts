import { AlicuotaIVA } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { PaymentCondition } from '@/modules/Forms/Accounting/CreateBillingForm/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getCleanErrorMessage = (err: Error) => {
    let message = err.message;

    if (!err.message) {
        return 'Error desconocido';
    }

    const firstErrorSplitted = err.message.split('Error: ');
    if (firstErrorSplitted.length > 1) {
        message = firstErrorSplitted.slice(1).join('');
    }

    return message;
};

export function stringifyObject(obj: Record<string, any>): string {
    let resultado = '';
    for (const propiedad in obj) {
        if (obj.hasOwnProperty(propiedad)) {
            resultado += `${propiedad}: ${
                typeof obj[propiedad] === 'object'
                    ? stringifyObject(obj[propiedad])
                    : obj[propiedad]
            }\n`;
        }
    }
    return resultado;
}

export function pascalCaseToSpaces(input: string): string {
    if (!input) {
        return input;
    }
    return input
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

export function capitalizeFirstLetter(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export function paymentConditionLabel(condition: PaymentCondition): string {
    switch (condition) {
        case 'Contado':
            return 'Contado';
        case 'CuentaCorriente':
            return 'Cuenta Corriente';
        case 'Cheque':
            return 'Cheque';
        case 'Transferencia':
            return 'Transferencia';
        case '15Dias':
            return '15 días';
        case '30Dias':
            return '30 días';
        case '60Dias':
            return '60 días';
        case '90Dias':
            return '90 días';
        case 'TarjetaCredito':
            return 'Tarjeta de Crédito';
        case 'Otros':
            return 'Otros';
        default:
            return 'Desconocido';
    }
}

export function AlicuotaIVALabel(alicuota: AlicuotaIVA): string {
    switch (alicuota) {
        case AlicuotaIVA.Exento:
            return 'Exento';
        case AlicuotaIVA.NoGravado:
            return 'No Gravado';
        case AlicuotaIVA.IVA_0:
            return '0%';
        case AlicuotaIVA.IVA_10_5:
            return '10.5%';
        case AlicuotaIVA.IVA_21:
            return '21%';
        case AlicuotaIVA.IVA_2_5:
            return '2.5%';
        case AlicuotaIVA.IVA_5:
            return '5%';
        case AlicuotaIVA.IVA_27:
            return '27%';
        default:
            return 'Desconocido';
    }
}

export function calculateIVAAmount(ammount: number, alicuotaIVA: AlicuotaIVA): number {
    switch (alicuotaIVA) {
        case AlicuotaIVA.Exento:
            return ammount;
        case AlicuotaIVA.NoGravado:
            return ammount;
        case AlicuotaIVA.IVA_0:
            return ammount;
        case AlicuotaIVA.IVA_10_5:
            return ammount * 0.15;
        case AlicuotaIVA.IVA_21:
            return ammount * 0.21;
        case AlicuotaIVA.IVA_2_5:
            return ammount * 0.025;
        case AlicuotaIVA.IVA_5:
            return ammount * 0.05;
        case AlicuotaIVA.IVA_27:
            return ammount * 0.27;
        default:
            return ammount;
    }
}
