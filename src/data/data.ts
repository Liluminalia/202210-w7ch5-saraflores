export type id = number | string;
export interface Data<T> {
    getAll: () => Promise<Array<T>>;
    get: (id: id) => Promise<T> | undefined;
    post: (data: Partial<T>) => Promise<T>;
    patch: (id: id, data: Partial<T>) => Promise<T>;
    delete: (id: id) => Promise<void>;
}
export interface DataRobot<Robot> {
    post: (data: Partial<Robot>) => Promise<Robot>;
}
