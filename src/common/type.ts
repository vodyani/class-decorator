export type ValidateMethod = (data: any) => boolean;

export type Method<T = any> = (...args: any[]) => T;

export type PromiseMethod<T = any> = (...args: any[]) => Promise<T>;
