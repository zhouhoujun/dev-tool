import { ITaskContext, Src } from 'development-core';
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
     * start.
     *
     * @returns {Promise<Src[]>}
     * @memberof IContext
     */
    start(): Promise<Src[]>;
}
