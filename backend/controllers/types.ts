export interface SuccessfulResponse<T> {
    data: T;
    error?: never;
    statusCode?: number;
}
export interface UnsuccessfulResponse<E> {
    data?: never;
    error: E;
    statusCode?: number;
}

export type ApiResponse<T, E = unknown> = SuccessfulResponse<T> | UnsuccessfulResponse<E>;
export type ResponseData = ApiResponse<any, string>;
