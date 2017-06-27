import { ITaskLoader } from './ITaskLoader';
import { IContext } from './IContext';
/**
 * loader factory.
 *
 * @export
 * @interface ILoaderFactory
 */
export interface ILoaderFactory {
    /**
     * create loader;
     *
     * @param {IContext} context
     * @returns {ITaskLoader}
     *
     * @memberof ILoaderFactory
     */
    create(context: IContext): ITaskLoader;
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
    create(context: IContext): ITaskLoader;
}
