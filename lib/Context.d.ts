import { TaskContext, ITaskConfig, ITaskContext } from 'development-core';
import { IContext } from './IContext';
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
export declare class Context extends TaskContext implements IContext {
    constructor(cfg: ITaskConfig, parent?: ITaskContext);
}
