import { ITaskLoader } from './ITaskLoader';
import { IEnvOption } from 'development-core';
import { ITaskOption, contextFactory } from './TaskOption';
/**
 * loader factory.
 *
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    /**
     * create loader.
     *
     * @param {ITaskOption} option
     * @param {IEnvOption} [env]
     * @param {contextFactory} [factory]
     * @returns {ITaskLoader}
     *
     * @memberOf ILoaderFactory
     */
    create(option: ITaskOption, env?: IEnvOption, factory?: contextFactory): ITaskLoader;
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
    create(option: ITaskOption, env?: IEnvOption, factory?: contextFactory): ITaskLoader;
}
