import { ITaskLoader } from './ITaskLoader';
import { ITaskOption } from 'development-core';
export interface ILoaderFactory {
    create(option: ITaskOption): ITaskLoader;
}
export declare class LoaderFactory implements ILoaderFactory {
    constructor();
    create(option: ITaskOption): ITaskLoader;
}
