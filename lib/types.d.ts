import { ITaskContext, ITaskConfig, ITask, IAssertOption, IDynamicTaskOption } from 'development-core';
import { ITaskOption } from './TaskOption';
/**
 * content factory type.
 */
export declare type contextFactory = (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext;
/**
 * task loader type
 */
export declare type TaskLoader = (ctx?: ITaskContext) => ITask[] | Promise<ITask[]>;
/**
 * task option.
 */
export declare type TaskOption = ITaskOption | IAssertOption | IDynamicTaskOption | Array<ITaskOption | IAssertOption | IDynamicTaskOption>;
