import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const mongooseDocumentToJSON = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<string, any> | Record<string, any>[],
>(
    doc: T,
): T => {
    return JSON.parse(JSON.stringify(doc));
};

export function dmyDateString(date: Date): string {
    return `${date.getDate() > 10 ? `${date.getDate()}` : `0${date.getDate()}`}/${
        date.getMonth() + 1 > 10 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
    }/${date.getFullYear()}`;
}

export function slugify(string: string): string {
    return string.replace(' ', '-');
}

export function deSlugify(string: string): string {
    return string.replace('-', ' ');
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
    return input
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        .replace(/(^\w|\s\w)/g, (m) => m.toLowerCase());
}
