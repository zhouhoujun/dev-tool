import { ITaskContext } from 'development-core';
import { ITaskLoader } from './ITaskLoader';
import { ILoaderFactory } from './loaderFactory';
/**
 * development context
 *
 * @export
 * @interface IContext
 * @extends {ITaskContext}
 */
export interface IContext extends ITaskContext {
    loaderFactory: ILoaderFactory;
    /**
     * get current context loader.
     *
     * @returns {ITaskLoader}
     * @memberof IContext
     */
    getLoader(): ITaskLoader;
}
