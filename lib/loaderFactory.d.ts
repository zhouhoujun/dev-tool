import { ITaskLoader } from './ITaskLoader';
import { TaskOption } from 'development-core';
export interface ILoaderFactory {
    create(option: TaskOption): ITaskLoader;
}
export declare class LoaderFactory implements ILoaderFactory {
    constructor();
    create(option: TaskOption): ITaskLoader;
}
