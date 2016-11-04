import { ITaskLoader } from './ITaskLoader';
import { ITaskOption } from 'development-core';
/**
 * loader factory.
 *
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    create(option: ITaskOption): ITaskLoader;
}
/**
 * loader factory.
 *
 * @export
 * @class LoaderFactory
 * @implements {ILoaderFactory}
 */
export declare class LoaderFactory implements ILoaderFactory {
    constructor();
    create(option: ITaskOption): ITaskLoader;
}
