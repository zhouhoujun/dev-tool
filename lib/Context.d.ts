import { ITaskContext, TaskContext, ITaskConfig, Src, ITask } from 'development-core';
import { IContext } from './IContext';
import { ILoaderFactory } from './loaderFactory';
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
    private loading;
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
    addTask(...task: ITask[]): void;
    removeTask(task: ITask): ITask[] | Promise<ITask[]>;
    private _loaderTasks;
    protected getLoaderTasks(): Promise<ITask[]>;
    /**
     * setup tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    setupTasks(): Promise<Src[]>;
    start(): Promise<Src[]>;
}
