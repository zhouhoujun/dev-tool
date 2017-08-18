import { ITask, ITaskDefine, ITaskContext } from 'development-core';
import { ModuleLoader } from './ModuleLoader';
import { IContext } from '../IContext';
/**
 * load task in directies.
 *
 * @export
 * @class DirLoader
 * @extends {ModuleLoader}
 */
export declare class DirLoader extends ModuleLoader {
    constructor(ctx: IContext);
    loadTasks(context: ITaskContext, def: ITaskDefine): Promise<ITask[]>;
    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine>;
}
