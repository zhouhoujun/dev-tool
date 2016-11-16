import { ITask, IContextDefine, ITaskOption, ITaskContext, IEnvOption } from 'development-core';
import { ModuleLoader } from './ModuleLoader';
export declare class DirLoader extends ModuleLoader {
    constructor(option: ITaskOption, env: IEnvOption);
    loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
