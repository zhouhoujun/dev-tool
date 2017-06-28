import { ITaskContext, TaskContext, ITaskConfig, Src, ITask } from 'development-core';
import { IContext } from './IContext';
import { TaskOption } from './TaskOption';
import { ILoaderFactory } from './loaderFactory';
/**
* create Context instance.
*
* @static
* @param {(ITaskConfig | TaskOption)} cfg
* @param {IContext} [parent]
* @returns {IContext}
* @memberof Context
*/
export declare function createConextInstance(cfg: ITaskConfig | TaskOption, parent?: IContext): IContext;
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export declare class Context extends TaskContext implements IContext {
    constructor(cfg: ITaskConfig, parent?: IContext);
    private loading;
    private _loaderfactory;
    loaderFactory: ILoaderFactory;
    /**
     * create new context;
     *
     * @param {ITaskConfig} cfg
     * @param {ITaskContext} [parent] default current context.
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    createContext(cfg: ITaskConfig, parent?: ITaskContext): ITaskContext;
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
