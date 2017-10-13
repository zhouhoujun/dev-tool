import { IContext } from './IContext';
import { ITaskLoader } from './ITaskLoader';
import { ILoaderFactory } from './loaderFactory';
import { TaskContext, ITaskConfig, ITaskContext } from 'development-core';
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export declare class Context extends TaskContext implements IContext {
    constructor(cfg: ITaskConfig);
    private _loaderfactory;
    loaderFactory: ILoaderFactory;
    /**
     * create new context;
     *
     * @param {ITaskConfig} cfg
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    protected createContext(cfg: ITaskConfig): ITaskContext;
    private _loader;
    getLoader(): ITaskLoader;
}
