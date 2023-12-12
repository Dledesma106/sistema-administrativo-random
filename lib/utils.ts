import {
    type IBranch,
    type IBusiness,
    type ICity,
    type IClient,
    type IProvince,
    type ITask,
} from 'backend/models/interfaces';
import { months } from 'backend/models/types';

export const formatIds = (doc: any): any => {
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
    return `${city.name}, ${(city.province as IProvince).name}`;
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
        province: (city.province as IProvince).name,
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
        businesses: branch.businesses.map((business) => trimBusiness(business)),
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
        assigned: task.assigned,
        image: task.image,
    };
}
