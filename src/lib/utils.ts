import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import {
    type IBranch,
    type IBusiness,
    type ICity,
    type IClient,
    type IProvince,
    type ITask,
} from 'backend/models/interfaces';
import { months } from 'backend/models/types';

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

export function toCityProvince(city: ICity): string {
    return `${city.name}, ${(city.provinceId as IProvince).name}`;
}

export function toMonth(num: number): string {
    return months[num];
}

export function trimProvince(province: IProvince): IProvince {
    return {
        _id: province._id,
        name: province.name,
        deleted: province.deleted,
    };
}

export function trimCity(city: ICity): ICity {
    return {
        _id: city._id,
        name: city.name,
        provinceId: (city.provinceId as IProvince).name,
        deleted: city.deleted,
    };
}

export function trimClient(client: IClient): IClient {
    return {
        _id: client._id,
        name: client.name,
        deleted: client.deleted,
    };
}

export function trimBusiness(business: IBusiness): IBusiness {
    return {
        _id: business._id,
        name: business.name,
        deleted: business.deleted,
    };
}

export function trimBranch(branch: IBranch): IBranch {
    return {
        _id: branch._id,
        number: branch.number,
        city: trimCity(branch.city),
        client: trimClient(branch.client),
        businessesIDs: branch.businessesIDs.map((business) => trimBusiness(business)),
        deleted: branch.deleted,
    };
}

export function trimTask(task: ITask): ITask {
    return {
        _id: task._id,
        branch: trimBranch(task.branch),
        business: trimBusiness(task.business),
        openedAt: task.openedAt,
        taskType: task.taskType,
        status: task.status,
        description: task.description,
        deleted: task.deleted,
        assignedIDs: task.assignedIDs,
        imagesIDs: task.imagesIDs,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
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
